.PHONY: run-local stop-local restart-local process-db-ssed

run-local:
	bash scripts/run-local.sh

stop-local:
	bash scripts/stop-local.sh

restart-local:
	bash scripts/restart-local.sh

process-db-ssed:
	bash scripts/process-db-seed.sh
