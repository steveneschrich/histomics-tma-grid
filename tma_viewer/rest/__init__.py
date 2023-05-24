from . import cat
def addEndpoints(apiRoot):
     """
    This adds endpoints from each module.

    :param apiRoot: Girder api root class.
    """
     cat.catHandler(apiRoot.item)