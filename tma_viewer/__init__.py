from girder import plugin
from .rest import cat

class GirderPlugin(plugin.GirderPlugin):
    DISPLAY_NAME = 'tma-viewer'
    CLIENT_SOURCE_PATH = 'web_client'

    def load(self, info):
        # add plugin loading logic here
        pass
