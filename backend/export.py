from shutil import copy, copyfile, copytree, rmtree
from urllib.parse import parse_qs
import falcon
import io
import json
import os
import re
import uuid
import zipfile

class Export():

    def on_get(self, req, resp):
        query_string = parse_qs(req.query_string)
        website_id = query_string['website-id'][0]

        os.makedirs("website")
        os.makedirs("website/css")
        os.makedirs("website/scripts")
        os.makedirs("website/library")
        os.makedirs("website/library/audios")
        os.makedirs("website/library/images")
        os.makedirs("website/library/models")
        os.makedirs("website/library/skyboxes")
        os.makedirs("website/library/scripts")

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data = None
        for website_record in data_store['websites']:
            if(website_record['id'] == website_id):
                pages = {}
                for page_record in website_record['pages']:
                    filename = "website/" + page_record['name'] + ".html"
                    copyfile("frontend/export-template.html", filename)
                    with open(filename) as f:
                        file_str = f.read()
                    file_str = file_str.replace("REPLACE_WITH_PAGE_ID", page_record['id'])
                    with open(filename, "w") as f:
                        f.write(file_str)
                    pages[page_record['id']] = page_record
                website_record['pages'] = pages
                data = { "website": website_record, "library": data_store['library'] }
                with open('website/website_info.json', 'w') as json_file:
                    json_file.write(json.dumps(data))
                break

        uuids = re.findall(r"[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}", str(data['website']))

        copy("frontend/css/xr-app.css", "website/css/")
        copy("frontend/scripts/jquery-3.4.1.min.js", "website/scripts/")
        copytree("frontend/scripts/three", "website/scripts/three")
        copytree("frontend/scripts/core", "website/scripts/core")
        copytree("frontend/library/defaults", "website/library/defaults")
        self.copy_files_from_library(uuids, "audios")
        self.copy_files_from_library(uuids, "images")
        self.copy_files_from_library(uuids, "models")
        self.copy_files_from_library(uuids, "scripts")
        self.copy_skyboxes_from_library(uuids)

        file_paths = self.get_all_file_paths("website")
        file_like_object = io.BytesIO()
        with zipfile.ZipFile(file_like_object,'a', zipfile.ZIP_DEFLATED) as zip:
            # writing each file one by one
            for file in file_paths:
                zip.write(file)
        rmtree("website")

        resp.status = falcon.HTTP_200
        resp.downloadable_as = 'website.zip'
        resp.body = file_like_object.getvalue()

    def get_all_file_paths(self, directory):
        # initializing empty file paths list
        file_paths = []
        # crawling through directory and subdirectories
        for root, directories, files in os.walk(directory):
            for filename in files:
                # join the two strings in order to form the full filepath.
                filepath = os.path.join(root, filename)
                file_paths.append(filepath)
        # returning all file paths
        return file_paths

    def copy_files_from_library(self, uuids, category):
        file_names = os.listdir("frontend/library/" + category)
        for file_name in file_names:
            uuid = file_name[0:file_name.rfind(".")]
            if(uuid in uuids):
                local_path = "library/" + category + "/" + file_name
                copy("frontend/" + local_path, "website/" + local_path)

    def copy_skyboxes_from_library(self, uuids):
        skyboxes = os.listdir("frontend/library/skyboxes")
        for uuid in skyboxes:
            if(uuid in uuids):
                local_path = "library/skyboxes/" + uuid
                copytree("frontend/" + local_path, "website/" + local_path)
