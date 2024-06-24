from config import app,api
from models import Booking,BlogPost,Menu,User,Gallery

if __name__ =="__main__":
    app.run(port=5555, debug=True)