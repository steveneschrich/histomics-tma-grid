import pytest

from girder.plugin import loadedPlugins


@pytest.mark.plugin('tma_viewer')
def test_import(server):
    assert 'tma_viewer' in loadedPlugins()
