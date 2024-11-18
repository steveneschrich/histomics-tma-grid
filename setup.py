from setuptools import setup, find_packages

with open('README.rst') as readme_file:
    readme = readme_file.read()

requirements = [
    'girder>=3.0.0a1',
    'girder-slicer-cli-web>=1.2.3',
    'girder-large-image-annotation>=1.23.0',
    'histomicsui>=1.4.5'
]

setup(
    author='Girder Developer',
    author_email='girder.developer@example.com',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'License :: OSI Approved :: Apache Software License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8'
    ],
    description='TMA viewer plugin for Girder',
    install_requires=requirements,
    license='Apache Software License 2.0',
    long_description=readme,
    long_description_content_type='text/x-rst',
    include_package_data=True,
    keywords='girder-plugin, tma_viewer',
    name='tma_viewer',
    packages=find_packages(exclude=['test', 'test.*']),
    url='https://github.com/steveneschrich/histomics-tma-grid',
    version='0.1.4',
    zip_safe=False,
    entry_points={
        'girder.plugin': [
            'tma_viewer = tma_viewer:GirderPlugin'
        ]
    }
)
