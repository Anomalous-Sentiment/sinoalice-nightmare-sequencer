#!/bin/bash
sudo certbot --nginx --non-interactive --agree-tos -m ${EMAIL} -d ${DOMAIN_1} -d ${DOMAIN_2}
sudo certbot renew