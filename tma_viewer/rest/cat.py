from girder.api.describe import Description, autoDescribeRoute
from girder.api import access

@access.public
@autoDescribeRoute(
    Description('Retrieve the cat for a given item.')
    .param('id', 'The item ID', paramType='path')
    .param('cat', 'The cat value.', required=False)
    .errorResponse())
def catHandler(id, cat):
    return {
       'itemId': id,
       'cat': cat
    }