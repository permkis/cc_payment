<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Cards as Cards;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Orders
 *
 * @ORM\Table(name="orders", indexes={@ORM\Index(name="orders_cards__fk", columns={"CARD_ID"})})
 * @ORM\Entity
 */
class Orders
{
    public function __construct()
    {
        $this->setCreatedDate(new \DateTime('now'));
    }

    /**
     * @var int
     *
     * @ORM\Column(name="ID", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return \DateTime|null
     */
    public function getCreatedDate(): ?\DateTime
    {
        return $this->createdDate;
    }

    /**
     * @param \DateTime|null $createdDate
     */
    public function setCreatedDate(?\DateTime $createdDate): void
    {
        $this->createdDate = $createdDate;
    }

    /**
     * @return string
     */
    public function getCost(): ?string
    {
        return $this->cost;
    }

    /**
     * @param string $cost
     */
    public function setCost(string $cost): void
    {
        $this->cost = $cost;
    }

    /**
     * @return string
     */
    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    /**
     * @param string $currency
     */
    public function setCurrency(string $currency): void
    {
        $this->currency = $currency;
    }

    /**
     * @return string|null
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string|null $comment
     */
    public function setComment(?string $comment): void
    {
        $this->comment = $comment;
    }

    /**
     * @return Cards
     */
    public function getCard(): Cards
    {
        return $this->card;
    }

    /**
     * @param Cards $card
     */
    public function setCard(Cards $card): void
    {
        $this->card = $card;
    }

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="CREATED_DATE", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $createdDate = null;

    /**
     * @var string
     *
     * @ORM\Column(name="COST", type="decimal", precision=9, scale=2, nullable=false)
     * @Assert\NotNull()
     */
    private $cost;

    /**
     * @var string
     *
     * @ORM\Column(name="CURRENCY", type="string", length=3, nullable=false)
     * @Assert\NotNull()
     */
    private $currency;

    /**
     * @var string|null
     *
     * @ORM\Column(name="COMMENT", type="string", length=200, nullable=true)
     * @Assert\NotNull()
     */
    private $comment;

    /**
     * @var Cards
     *
     * @ORM\ManyToOne(targetEntity="Cards")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="CARD_ID", referencedColumnName="ID")
     * })
     */
    private $card;


}
