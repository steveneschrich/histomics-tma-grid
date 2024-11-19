from girder import events, logger, plugin
from .rest import cat

class GirderPlugin(plugin.GirderPlugin):
    DISPLAY_NAME = 'tma-viewer'
    CLIENT_SOURCE_PATH = 'web_client'

    def load(self, info):
        try:
            plugin.getPlugin('histomicsui').load(info)
        except Exception:
            logger.info('histomics plugin is unavailable.')
        pass
