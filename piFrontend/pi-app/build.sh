ember build
#ember build --environment=production
rm -rf ~/pi_projects/piWebserver/assets
rm ~/pi_projects/piWebserver/service-worker-*
rm ~/pi_projects/piWebserver/sw-toolbox-*

cp -r dist/* ~/pi_projects/piWebserver/
