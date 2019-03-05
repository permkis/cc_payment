<?php

namespace App\Controller;

use App\Entity\Cards;
use App\Entity\Orders;
use App\Form\PaymentForm;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */

    public function index()
    {
        return $this->redirect('pay');
    }

    /**
     * @Route("/pay", name="pay")
     */
    public function payment(Request $request)
    {
        $card = new Cards();

        $form = $this->createForm(PaymentForm::class, $card);
        $form->add('save', SubmitType::class, array('label' => 'Оплатить'));

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $card = $form->getData();
            $pad = $card->getPad();

            //Ищем карту с таким же номером
            $cards = $this->getDoctrine()->getRepository(Cards::class);
            $found = $cards->findOneBy(array('pad' => $pad));

            $em = $this->getDoctrine()->getManager();

            //Если карта найдена, проверяем остальные поля
            //если хоть одно не совпадает - оплата не прошла
            if ($found) {
                if (($found->getCardholder() == $card->getCardholder()
                    && $found->getExpMonth() == $card->getExpMonth()
                    && $found->getExpYear() == $card->getExpYear())
                ) {
                    //Карта совпала, используем ее
                    $card = $found;
                } else {
                    $this->addFlash(
                        'invalid-card',
                        "Неверные данные карты"
                    );
                    return $this->redirect('pay');
                }
            } else {
                //Карта новая - добавляем
                $em->persist($card);
            }

            $order = new Orders();
            $order->setCost($form->get('cost')->getData());
            $order->setCurrency($form->get('currency')->getData());
            $order->setComment($form->get('comment')->getData());
            $order->setCard($card);

            $em->persist($order);
            $em->flush();

            $cost = $order->getCost();
            $cur = $order->getCurrency();
            $orderId = $order->getId();

            $this->addFlash(
                'notice',
                'Заказ №' . $orderId . '. Платеж на сумму ' . $cost . $cur . ' прошел успешно.'
            );

            return $this->redirect('pay');
        }

        return $this->render('payment.html.twig', array('form' => $form->createView()));
    }

    /**
     * @Route("/history", name="history")
     */
    public function history()
    {
        $em = $this->getDoctrine()->getRepository(Orders::class);
        $orders = $em->findAll();

        return $this->render('history.html.twig',array('orders'=>$orders));
    }
}
