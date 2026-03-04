#!/usr/bin/env bash
docker exec -i plant-helper-db-1 /usr/bin/pg_dump -U forrana postgres > postgres-backup-$(date +%F).sql
