from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager
# import secrets

# secret_key = secrets.token_hex(32)
# print(secret_key)

app=Flask(__name__)
app.config['SECRET_KEY'] = '950f0f263d20fbb04b8a4b29a42c1377655a877c70df2ef1690d166bd5ff5198' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///masterly.db'
app.config['JWT_SECRET_KEY'] = 'f72c13cb465603659a3a537c55b4fd32946b66d6a4f3fa600121a9bdc79e9415'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 600
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db =SQLAlchemy(metadata=metadata)
migrate = Migrate(app,db)
db.init_app(app)
api = Api(app)
CORS(app, supports_credentials=True)
jwt=JWTManager(app)
