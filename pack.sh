#!/bin/bash
# Pack the site folder for Netlify
cd /home/user
rm -f /mnt/user-data/outputs/hp-tuning-site.zip
zip -r /mnt/user-data/outputs/hp-tuning-site.zip site/
echo "Done. File size:"
ls -lh /mnt/user-data/outputs/hp-tuning-site.zip
echo "Files:"
unzip -l /mnt/user-data/outputs/hp-tuning-site.zip | head -50
