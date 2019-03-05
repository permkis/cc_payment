<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Cards
 *
 * @ORM\Table(name="cards", uniqueConstraints={@ORM\UniqueConstraint(name="cards_PAD_uindex", columns={"PAD"})})
 * @ORM\Entity(repositoryClass="App\Repository\CardsRepository")
 */
class Cards
{
    /**
     * @var int
     *
     * @ORM\Column(name="ID", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="PAD", type="string", length=19, nullable=false)
     * @Assert\NotNull()
     */
    private $pad;

    /**
     * @var string
     *
     * @ORM\Column(name="CARDHOLDER", type="string", length=27, nullable=false)
     * @Assert\NotNull()
     */
    private $cardholder;

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
     * @return string
     */
    public function getPad(): ?string
    {
        return $this->pad;
    }

    /**
     * @param string $pad
     */
    public function setPad(string $pad): void
    {
        $this->pad = str_replace(' ','',$pad);
    }

    /**
     * @return string
     */
    public function getCardholder(): ?string
    {
        return $this->cardholder;
    }

    /**
     * @param string $cardholder
     */
    public function setCardholder(string $cardholder): void
    {
        $this->cardholder = $cardholder;
    }

    /**
     * @return string
     */
    public function getExpMonth(): ?string
    {
        return $this->expMonth;
    }

    /**
     * @param string $expMonth
     */
    public function setExpMonth(string $expMonth): void
    {
        $this->expMonth = $expMonth;
    }

    /**
     * @return string
     */
    public function getExpYear(): ?string
    {
        return $this->expYear;
    }

    /**
     * @param string $expYear
     */
    public function setExpYear(string $expYear): void
    {
        $this->expYear = $expYear;
    }

    /**
     * @var string
     *
     * @ORM\Column(name="EXP_MONTH", type="string", length=2, nullable=false)
     * @Assert\NotNull()
     */
    private $expMonth;

    /**
     * @var string
     *
     * @ORM\Column(name="EXP_YEAR", type="string", length=4, nullable=false)
     * @Assert\NotNull()
     */
    private $expYear;


}
