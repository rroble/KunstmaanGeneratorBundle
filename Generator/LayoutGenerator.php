<?php

namespace Kunstmaan\GeneratorBundle\Generator;

use Symfony\Component\HttpKernel\Bundle\BundleInterface;

/**
 * Generates all layout files
 */
class LayoutGenerator extends KunstmaanGenerator
{
    /**
     * @var BundleInterface
     */
    private $bundle;

    /**
     * @var string
     */
    private $rootDir;

    /**
     * Generate the basic layout.
     *
     * @param BundleInterface $bundle         The bundle
     * @param string          $rootDir        The root directory of the application
     */
    public function generate(BundleInterface $bundle, $rootDir)
    {
        $this->bundle = $bundle;
        $this->rootDir = $rootDir;

        $this->generateGulpFiles();
        $this->generateBowerFiles();
        $this->generateBundlerFiles();
        $this->generateUIAssets();
        $this->generateTemplate();
    }

    /**
     * Generate the Gulp configuration files.
     */
    private function generateGulpFiles()
    {
        $this->renderFiles($this->skeletonDir.'/gulp/', $this->rootDir, array('bundle' => $this->bundle), true);
        $this->renderSingleFile($this->skeletonDir.'/gulp/', $this->rootDir, '.jshintrc', array('bundle' => $this->bundle), true);
        $this->assistant->writeLine('Generating Gulp configuration files : <info>OK</info>');
    }

    /**
     * Generate the Bower configuration files.
     */
    private function generateBowerFiles()
    {
        $this->renderFiles($this->skeletonDir.'/bower/', $this->rootDir, array('bundle' => $this->bundle), true);
        $this->renderSingleFile($this->skeletonDir.'/bower/', $this->rootDir, '.bowerrc', array('bundle' => $this->bundle), true);
        $this->assistant->writeLine('Generating Bower configuration files : <info>OK</info>');
    }

    /**
     * Generate the Bundler configuration files.
     */
    private function generateBundlerFiles()
    {
        $this->renderFiles($this->skeletonDir.'/bundler/', $this->rootDir, array('bundle' => $this->bundle), true);
        $this->assistant->writeLine('Generating Bundler configuration files : <info>OK</info>');
    }

    /**
     * Generate the UI asset files.
     */
    private function generateUIAssets()
    {
        $sourceDir = $this->skeletonDir;
        $targetDir = $this->bundle->getPath();

        $relPath = '/Resources/ui/';
        $this->copyFiles($sourceDir.$relPath, $targetDir.$relPath, true);

        $relPath = '/Resources/ui/scss/config/';
        $this->renderSingleFile($sourceDir.$relPath, $targetDir.$relPath, '_paths.scss', array('bundle' => $this->bundle), true);

        $this->assistant->writeLine('Generating UI assets : <info>OK</info>');
    }

    /**
     * Generate the twig template files.
     */
    private function generateTemplate()
    {
        $relPath = '/Resources/views/';
        $this->renderFiles($this->skeletonDir.$relPath, $this->bundle->getPath().$relPath, array('bundle' => $this->bundle), true);

        $this->assistant->writeLine('Generating template files : <info>OK</info>');
    }
}
