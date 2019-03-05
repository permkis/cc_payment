<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class PaymentForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('cost', NumberType::class, array(
                'scale' => 2,
                'mapped' => false
            ))
            ->add('currency', ChoiceType::class, array(
                'choices' => array(
                    'RUB' => 'RUB',
                    'USD' => 'USD'
                ),
                'preferred_choices' => function ($value) {
                    return $value <= 'RUB';
                },
                'mapped' => false
            ))
            ->add('pad', TextType::class)
            ->add('cardholder', TextType::class)
            ->add('expMonth', TextType::class)
            ->add('expYear', TextType::class)
            ->add('code', PasswordType::class, array('mapped' => false))
            ->add('comment', TextareaType::class, array(
                'required' => false,
                'mapped' => false));
    }

}