import falcon
from falcon_cors import CORS
from falcon_multipart.middleware import MultipartMiddleware
from .data_store import DataStore
from .image import Image
from .image_name import ImageName

cors = CORS(allow_origins_list=['http://127.0.0.1:8100'],
            allow_all_headers=True,
            allow_all_methods=True)
api = application = falcon.API(middleware=[cors.middleware, MultipartMiddleware()])

data_store = DataStore()
image = Image()
image_name = ImageName()
api.add_route('/data-store', data_store)
api.add_route('/image', image)
api.add_route('/image/name', image_name)
