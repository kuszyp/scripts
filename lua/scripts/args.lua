local args = {}

function args.get(name)
	local value
	for i, v in ipairs(arg) do
		if arg[i] == "--" .. name then
			value = arg[i + 1]
		end
	end

	if not value then
		print("Error: No " .. name .. " value passed")
		os.exit(1)
	end
	return value
end

return args
