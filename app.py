import os
import datetime
import logging
import random
from functools import wraps
from random import choice
from collections import Counter

# Importing flask
from flask import Flask, render_template, request, Response, make_response,  redirect, url_for
# Required for saving prescription images
from werkzeug.utils import secure_filename

from config import config

# Set up logging
logfilepath = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           config.get("Server Parameters", "logfile"))

loglevels = [logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL]
loglevel = loglevels[config.getint('Server Parameters', 'loglevel')]
logging.basicConfig( filename=logfilepath, format='%(asctime)s %(message)s', level=loglevel )

# config.get( 'Mechanical Turk Info', 'aws_secret_access_key' )

# constants
USING_SANDBOX = config.getboolean('HIT Configuration', 'using_sandbox')
CODE_VERSION = config.get('Task Parameters', 'code_version')

# Database configuration and constants
TABLENAME = config.get('Database Parameters', 'table_name')
SUPPORTIE = config.getboolean('Server Parameters', 'support_IE')

# Status codes
ALLOCATED = 1
STARTED = 2
COMPLETED = 3
DEBRIEFED = 4
CREDITED = 5
QUITEARLY = 6


app = Flask(__name__)
# Limit the size of the files that can be uploaded and saved
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
#----------------------------------------------
# function for authentication
#----------------------------------------------
queryname = config.get('Server Parameters', 'login_username')
querypw = config.get('Server Parameters', 'login_pw')

def wrapper(func, args):
    return func(*args)
# For prescription saving
# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_auth(username, password):
    """This function is called to check if a username /
        password combination is valid.
        """
    return username == queryname and password == querypw

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
                    'Could not verify your access level for that URL.\n'
                    'You have to login with proper credentials', 401,
                    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    """
        Decorator to prompt for user name and password. Useful for data dumps, etc.
        that you don't want to be public.
        """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

#----------------------------------------------
# ExperimentError Exception, for db errors, etc.
#----------------------------------------------
# Possible ExperimentError values.
experiment_errors = dict(
                         status_incorrectly_set = 1000,
                         hit_assign_worker_id_not_set_in_mturk = 1001,
                         hit_assign_worker_id_not_set_in_consent = 1002,
                         hit_assign_worker_id_not_set_in_exp = 1003,
                         hit_assign_appears_in_database_more_than_once = 1004,
                         already_started_exp = 1008,
                         already_started_exp_mturk = 1009,
                         already_did_exp_hit = 1010,
                         tried_to_quit= 1011,
                         intermediate_save = 1012,
                         improper_inputs = 1013,
                         page_not_found = 404,
                         in_debug = 2005,
                         unknown_error = 9999
                         )

class ExperimentError(Exception):
    """
        Error class for experimental errors, such as subject not being found in
        the database.
        """
    def __init__(self, value):
        self.value = value
        self.errornum = experiment_errors[self.value]
    def __str__(self):
        return repr(self.value)
    def error_page(self, request):
        return render_template('error.html',
                               errornum=self.errornum,
                               **request.args)

@app.errorhandler(ExperimentError)
def handleExpError(e):
    """Handle errors by sending an error page."""
    return e.error_page( request )


#----------------------------------------------
# routes
#----------------------------------------------

@app.route('/PIPSinfo', methods=['GET'])
def start_exp():
    print request.args
    """
        Serves up the experiment applet.
        """

    if not request.remote_addr:
            myip = "UKNOWNIP"
    else:
            myip = request.remote_addr

    return render_template('Info_Consent.html')



@app.route('/done', methods=['POST', 'GET'])
def savedata():
    """
        User has given consent and is posting their contact data in the form of a
        (long) string.
        """
    print request.form.keys()

    if not request.form.has_key('data') and request.form.has_key('subjectid'):
            raise ExperimentError('improper_inputs')

    subjectId = request.form['subjectid']
    datastring = request.form['data']
    when = request.form['when']
    print datastring
    print subjectId

    datafile = open('Data/Consent/'+subjectId+'_'+when+'.csv', 'w')
    datafile.write(datastring)
    datafile.close()


    print "saving consent data"

    return render_template('endTask.html')

@app.route('/quitter', methods=['POST'])
def quitter():
    """
    Subjects post data as they quit, to help us better understand the quitters.
    """

    print "accessing the /quitter route"
    print request.form.keys()
    datastring = request.form['dataString']
    subjectId = request.form['subjectid']

    datafile = open('quitters/'+subjectId+'.csv', 'w')
    datafile.write(datastring)

    if  request.form.has_key('dataString') and request.form.has_key('subjectid') :
        datastring = request.form['dataString']
        subjectId = request.form['subjectid']

        print "getting the save data", subjectId, datastring

    return render_template('error.html', errornum= experiment_errors['tried_to_quit'])
#
# @app.route('/interest', methods=['POST'])
# def interest():
#     """
#         User has indicated no consent but is posting their contact data in the form of a
#         (long) string.
#         """
#
#     print "no consent but interested"
#     print request.form.keys()
#
#     if not request.form.has_key('data') and request.form.has_key('subjectid'):
#             raise ExperimentError('improper_inputs')
#
#     subjectId = request.form['subjectid']
#     datastring = request.form['data']
#     print datastring
#     print subjectId
#
#     datafile = open('interestdata/'+subjectId+'.csv', 'w')
#     datafile.write(datastring)
#     datafile.close()
#
#     print "saving interest data"
#
#     errors = []
#     results = {}
#     if request.method == "POST":
#         # get url that the user has entered
#         try:
#             url = request.form['url']
#             r = requests.get(url)
#             print(r.text)
#         except:
#             errors.append(
#                 "Unable to get URL. Please make sure it's valid and try again."
#             )
#     return render_template('closepopup.html', errors=errors, results=results)


#----------------------------------------------
# generic route
#----------------------------------------------
@app.route('/<pagename>')
def regularpage(pagename=None):
    """
        Route not found by the other routes above. May point to a static template.
        """
    if pagename==None:
        raise ExperimentError('page_not_found')
    return render_template(pagename)

###########################################################
# let's start
###########################################################
if __name__ == '__main__':

    print "Starting webserver."
    app.run(debug=config.getboolean('Server Parameters', 'debug'), host='0.0.0.0', port=config.getint('Server Parameters', 'port'))
