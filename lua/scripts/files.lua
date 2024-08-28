local files = {}

function files.copy(source, destination)
	-- open the source file in read binary mode
	local src_file, err = io.open(source, "rb")
	if not src_file then
		print("Error opening source file [" .. source .. "]: " .. err)
		os.exit(1)
	end

	-- open the destination file in write binary mode
	local dest_file, err = io.open(destination, "wb")
	if not dest_file then
		src_file:close()
		print("Error opening destination file [" .. destination .. "]: " .. err)
		os.exit(1)
	end

	-- read the content from the source and write it to the destination file
	local content = src_file:read("*all")
	dest_file:write(content)

	-- close files
	src_file:close()
	dest_file:close()

	return true
end

function files.extract_war(war_file, output_dir)
	-- ensure we have output directory
	os.execute("mkdir -p" .. output_dir)

	-- command to unzip war file
	local command = "unzip -o " .. war_file .. " -d " .. output_dir

	local success, err = os.execute(command)
	if not success then
		print("Error extracting file [" .. war_file .. "]: " .. err)
	end

	return true
end

return files
