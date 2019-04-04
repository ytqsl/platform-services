# Deployment of HA Postgres DB (patroni)

## Steps

1. Verify image exists in bcgov namespace
``` bash
oc get is patroni -n bcgov
```

2. Create parameter file for Stateful Set
``` yaml
NAME=artifactory-pgsql
cat << EOT > ${NAME}.env
NAME=${NAME}
IMAGE_STREAM_TAG=patroni:v10-stable
PVC_SIZE=5Gi
EOT
```

3. Deploy Patroni Stateful Set
``` bash
oc process -f artifactory-pgsql-prereq.yaml --param-file=${NAME}.env --ignore-unknown-parameters=true | oc apply -f -

oc process -f artifactory-pgsql.yaml --param-file=${NAME}.env | oc apply -f -

```

4. Cleanup All
``` bash
# Clean everthing
oc delete all -l cluster-name=artifactory-pgsql
oc delete pvc,secret,configmap,rolebinding,role -l cluster-name=artifactory-pgsql
oc delete statefulset,service,endpoints -l cluster-name=artifactory-pgsql
