import falcon
from falcon_cors import CORS
from falcon_multipart.middleware import MultipartMiddleware
#from falcon_require_https import RequireHTTPS
from .data_store import DataStore
from .website import Website
from .websites import Websites
from .page import Page
from .export import Export
from .model import Model
from .model_name import ModelName
from .model_version import ModelVersion
from .light_version import LightVersion
from .audio import Audio
from .audio_name import AudioName
from .image import Image
from .image_name import ImageName
from .skybox import Skybox
from .script import Script
from .script_name import ScriptName

cors = CORS(allow_origins_list=['http://localhost:8100', 'http://127.0.0.1:8100', 'http://kalegaurd.local:8100', 'http://192.168.100.17:8100'],
            allow_all_headers=True,
            allow_all_methods=True)
#api = application = falcon.API(middleware=[RequireHTTPS(), cors.middleware, MultipartMiddleware()])
api = application = falcon.API(middleware=[cors.middleware, MultipartMiddleware()])

data_store = DataStore()
website = Website()
websites = Websites()
page = Page()
export = Export()
model = Model()
model_name = ModelName()
model_version = ModelVersion()
light_version = LightVersion()
audio = Audio()
audio_name = AudioName()
image = Image()
image_name = ImageName()
skybox = Skybox()
script = Script()
script_name = ScriptName()
api.add_route('/data-store', data_store)
api.add_route('/website', website)
api.add_route('/websites', websites)
api.add_route('/page', page)
api.add_route('/export', export)
api.add_route('/library/model', model)
api.add_route('/library/model/name', model_name)
api.add_route('/library/model/version', model_version)
api.add_route('/library/light/version', light_version)
api.add_route('/library/audio', audio)
api.add_route('/library/audio/name', audio_name)
api.add_route('/library/image', image)
api.add_route('/library/image/name', image_name)
api.add_route('/library/skybox', skybox)
api.add_route('/library/script', script)
api.add_route('/library/script/name', script_name)
