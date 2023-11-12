from django.db import models

# Create your models here.
class BlacklistSrc(models.Model):
    
    SRC_TYPES = (
        ('github', 'github'),
    )
    
    url = models.TextField()
    file_type = models.CharField(max_length=10)
    src_type = models.CharField(choices=SRC_TYPES, null=False, default="github", max_length=128)
    
    class Meta:
        db_table = "blacklistsrc"


class WhitelistSrc(models.Model):
    
    SRC_TYPES = (
        ('github', 'github'),
    )
    
    url = models.TextField()
    file_type = models.CharField(max_length=10)
    src_type = models.CharField(choices=SRC_TYPES, null=False, default="github", max_length=128)
    
    class Meta:
        db_table = "whitelistsrc"
