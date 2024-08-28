local lfs = require("lfs")

-- local modules
local scripts = require("scripts/scripts")
local files = require("scripts/files")
----------------------------------------------------

-- Move to the scim2 module directory
local success, err =
	lfs.chdir("/home/kuszyp/o4b/gitlab.o4b.tech/pu/ciam/wso2-extensions/identity-inbound-provisioning-scim2/")
if not success then
	print("Failed to change directory: " .. err)
	os.error(1)
end

-- run mvn clean install
local output = scripts.run("mvn clean install")

-- check if build was success
local start_pos, end_pos = string.find(output, "BUILD SUCCESS")
if not start_pos then
	print(output)
	os.error(1)
end

local jar_filename = "org.wso2.carbon.identity.scim2.common-3.4.7.jar"
local jar_dest_filename = "org.wso2.carbon.identity.scim2.common_3.4.7.jar"
local jar_source_path = "components/org.wso2.carbon.identity.scim2.common/target/"
local jar_dest_path = "/home/kuszyp/o4b/wso2is-docker-config/conf/wso2is/repository/components/plugins/"

-- remove old jar file from the destination path
local success, err = os.remove(jar_dest_path .. jar_dest_filename)
if success then
	print("Removed file: " .. jar_dest_filename)
end

-- copy new jar file
files.copy(jar_source_path .. jar_filename, jar_dest_path .. jar_dest_filename)

local war_dest_path = "/home/kuszyp/o4b/wso2is-docker-config/conf/wso2is/repository/deployment/server/webapps/"
local war_filename = "scim2.war"
local war_source_path = "components/org.wso2.carbon.identity.scim2.provider/target/"

-- remove old scim2 folder
local success, err = os.execute("rmdir -f " .. war_dest_path .. "scim")
if not success then
	print("Error removing directory: " .. err)
	os.exit(1)
else
	print("Removed directory scim2")
end

-- copy scim2.war file to the destination path
files.copy(war_source_path .. war_filename, war_dest_path .. war_filename)

-- extract scim.war file
files.extract_war(war_dest_path .. war_filename, war_dest_path .. "scim2")

-- remove scim2.war file from destination path
local success, err = os.remove(war_dest_path .. war_filename)
if success then
	print("Removed file: " .. war_filename)
end
