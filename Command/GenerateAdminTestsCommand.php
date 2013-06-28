<?php

namespace Kunstmaan\GeneratorBundle\Command;

use Sensio\Bundle\GeneratorBundle\Command\GeneratorCommand;
use Kunstmaan\GeneratorBundle\Generator\AdminTestsGenerator;
use Symfony\Component\Console\Input\InputOption;
use Sensio\Bundle\GeneratorBundle\Command\Validators;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputInterface;

/**
 * GenerateAdminTestsCommand
 */
class GenerateAdminTestsCommand extends GeneratorCommand
{

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setDefinition(
                array(
                    new InputOption('namespace', '', InputOption::VALUE_REQUIRED, 'The namespace to generate the tests in'),
                )
            )
            ->setDescription('Generates the tests used to test the admin created by the default-site generator')
            ->setHelp(<<<EOT
The <info>kuma:generate:admin-test</info> command generates tests to test the admin generated by the default-site generator

<info>php app/console kuma:generate:admin-tests --namespace=Namespace/NamedBundle</info>

EOT
            )
            ->setName('kuma:generate:admin-tests');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dialog = $this->getDialogHelper();

        foreach (array('namespace') as $option) {
            if (null === $input->getOption($option)) {
                throw new \RuntimeException(sprintf('The "%s" option must be provided.', $option));
            }
        }

        $namespace = Validators::validateBundleNamespace($input->getOption('namespace'));
        $bundle = strtr($namespace, array('\\' => ''));

        $bundle = $this
            ->getApplication()
            ->getKernel()
            ->getBundle($bundle);
        $dialog->writeSection($output, 'Admin Tests Generation');

        $generator = $this->getGenerator($this->getApplication()->getKernel()->getBundle("KunstmaanGeneratorBundle"));
        $generator->generate($bundle, $output);
    }

    /**
     * {@inheritdoc}
     */
    protected function interact(InputInterface $input, OutputInterface $output)
    {
        $dialog = $this->getDialogHelper();
        $dialog->writeSection($output, 'Welcome to the Kunstmaan default site generator');

        // namespace
        $namespace = null;
        try {
            $namespace = $input->getOption('namespace') ? Validators::validateBundleNamespace($input->getOption('namespace')) : null;
        } catch (\Exception $error) {
            $output->writeln($dialog->getHelperSet()->get('formatter')->formatBlock($error->getMessage(), 'error'));
        }

        if (is_null($namespace)) {
            $output->writeln(array(
                '',
                'This command helps you to generate tests to test the admin of the default site setup.',
                'You must specify the namespace of the bundle where you want to generate the tests.',
                'Use <comment>/</comment> instead of <comment>\\ </comment>for the namespace delimiter to avoid any problem.',
                '',
            ));

            $namespace = $dialog->askAndValidate($output, $dialog->getQuestion('Bundle namespace', $namespace), array('Sensio\Bundle\GeneratorBundle\Command\Validators', 'validateBundleNamespace'), false, $namespace);
            $input->setOption('namespace', $namespace);
        }
    }

    protected function createGenerator()
    {
        return new AdminTestsGenerator($this->getContainer()->get('filesystem'), '/admintests');
    }
}
