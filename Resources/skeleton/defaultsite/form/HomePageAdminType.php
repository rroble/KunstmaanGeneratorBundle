<?php

namespace {{ namespace }}\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class HomePageAdminType extends AbstractType
{
    /**
     * @param FormBuilderInterface  $builder The builder
     * @param array                 $options The options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title');
    }

    /**
     * @assert () == 'homepage'
     *
     * @return string
     */
    public function getName()
    {
        return 'homepage';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array('data_class' => '{{ namespace }}\Entity\HomePage'));
    }
}