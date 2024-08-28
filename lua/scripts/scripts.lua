local scripts = {}

function scripts.run(command)
	local handle = io.popen(command)
	local result = handle:read("*a")
	handle:close()

	return result
end

return scripts
