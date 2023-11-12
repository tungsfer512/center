import smtplib
import os
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from CenterServer.env_dev import *

def send_email(subject, body, recipients, sender=get_env('SENDER_EMAIL', None), password=get_env('SENDER_APP_PASSWORD', None), files=["./devices/attach.xlsx"], send_file = False):
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = COMMASPACE.join(recipients)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    msg.attach(MIMEText(body))
    try:
        smtp_server = smtplib.SMTP('smtp-mail.outlook.com', 587)
    except Exception as e:
        print(e)
        smtp_server = smtplib.SMTP_SSL('smtp-mail.outlook.com', 465)
    if send_file == True:
        for f in files or []:
            with open(f, "rb") as fil:
                part = MIMEApplication(
                    fil.read(),
                    Name=basename(f)
                )
            # After the file is closed
            part['Content-Disposition'] = 'attachment; filename="%s"' % basename(f)
            msg.attach(part)
    smtp_server.ehlo()
    smtp_server.starttls()
    smtp_server.login(sender, password)
    smtp_server.sendmail(sender, recipients, msg.as_string())
    smtp_server.quit()
    smtp_server.close()

# if __name__ == "__main__":
#     subject = "Email Subject"
#     body = "This is the body of the text message"
#     sender = "tbvb19dccn625@gmail.com"
#     recipients = ["tungbv51201sf@gmail.com"]
#     password = "ynqnbvendplkxvsw"

#     send_email(subject, body, sender, recipients, password)