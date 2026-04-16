#!/bin/bash
cd /home/user
rm -f /mnt/user-data/outputs/hp-tuning-site.zip
zip -r /mnt/user-data/outputs/hp-tuning-site.zip site/ -x "site/ИНСТРУКЦИЯ.md"
echo "ZIP created:"
ls -lh /mnt/user-data/outputs/hp-tuning-site.zip
echo ""
echo "Files count: $(unzip -l /mnt/user-data/outputs/hp-tuning-site.zip | tail -1)"
