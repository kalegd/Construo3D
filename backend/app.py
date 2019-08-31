import falcon
from falcon_cors import CORS
from falcon_multipart.middleware import MultipartMiddleware
from .data_store import DataStore
from .website import Website
from .websites import Websites
from .page import Page
from .model import Model
from .model_name import ModelName
from .model_version import ModelVersion
from .light_version import LightVersion
from .image import Image
from .image_name import ImageName
from .skybox import Skybox

cors = CORS(allow_origins_list=['http://127.0.0.1:8100','http://192.168.1.12:8100'],
            allow_all_headers=True,
            allow_all_methods=True)
api = application = falcon.API(middleware=[cors.middleware, MultipartMiddleware()])

data_store = DataStore()
website = Website()
websites = Websites()
page = Page()
model = Model()
model_name = ModelName()
model_version = ModelVersion()
light_version = LightVersion()
image = Image()
image_name = ImageName()
skybox = Skybox()
api.add_route('/data-store', data_store)
api.add_route('/website', website)
api.add_route('/websites', websites)
api.add_route('/page', page)
api.add_route('/library/model', model)
api.add_route('/library/model/name', model_name)
api.add_route('/library/model/version', model_version)
api.add_route('/library/light/version', light_version)
api.add_route('/library/image', image)
api.add_route('/library/image/name', image_name)
api.add_route('/library/skybox', skybox)
