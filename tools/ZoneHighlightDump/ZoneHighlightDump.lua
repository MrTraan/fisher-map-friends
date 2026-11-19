-- Zone Highlight Dump
--
-- Asks the game which highlight image the world map shows for every zone of every
-- continent, and where that image sits on the continent map. It only reads map data;
-- it changes nothing in the game.
--
-- Usage: type /zonedump in chat, then /reload (or log out) so the result is written to
--   WTF\Account\<account>\SavedVariables\ZoneHighlightDump.lua

local GRID = 240 -- sample points per axis; fine enough to hit every zone

local function atlasInfo(atlas)
  if not atlas or atlas == "" or not C_Texture or not C_Texture.GetAtlasInfo then return nil end
  local a = C_Texture.GetAtlasInfo(atlas)
  if not a then return nil end
  return {
    file = a.file, filename = a.filename, width = a.width, height = a.height,
    left = a.leftTexCoord, right = a.rightTexCoord, top = a.topTexCoord, bottom = a.bottomTexCoord,
  }
end

local function dumpContinent(info)
  local id = info.mapID
  local out = { mapID = id, name = info.name, highlights = {}, zones = {}, art = {} }

  -- The continent picture itself: its size and the image tiles it is made of.
  local layers = C_Map.GetMapArtLayers(id) or {}
  for i, layer in ipairs(layers) do
    out.art[i] = {
      layerWidth = layer.layerWidth, layerHeight = layer.layerHeight,
      tileWidth = layer.tileWidth, tileHeight = layer.tileHeight,
      textures = C_Map.GetMapArtLayerTextures(id, i),
    }
  end

  -- Every zone of the continent and its bounding box on the continent map (0..1).
  for _, child in ipairs(C_Map.GetMapChildrenInfo(id, nil, false) or {}) do
    local minX, maxX, minY, maxY = C_Map.GetMapRectOnMap(child.mapID, id)
    out.zones[#out.zones + 1] = {
      mapID = child.mapID, name = child.name, mapType = child.mapType,
      minX = minX, maxX = maxX, minY = minY, maxY = maxY,
    }
  end

  -- Sweep the map and collect each distinct highlight the game reports.
  local seen = {}
  for gy = 0, GRID do
    for gx = 0, GRID do
      local x, y = gx / GRID, gy / GRID
      local file, atlas, pctX, pctY, texX, texY, posX, posY = C_Map.GetMapHighlightInfoAtPosition(id, x, y)
      if file or (atlas and atlas ~= "") then
        local key = tostring(file) .. "|" .. tostring(atlas) .. "|" .. tostring(posX) .. "|" .. tostring(posY)
        local entry = seen[key]
        if not entry then
          local at = C_Map.GetMapInfoAtPosition(id, x, y)
          entry = {
            fileDataID = file, atlasID = atlas, atlas = atlasInfo(atlas),
            texturePercentageX = pctX, texturePercentageY = pctY,
            textureX = texX, textureY = texY,
            scrollChildX = posX, scrollChildY = posY,
            zoneMapID = at and at.mapID, zoneName = at and at.name,
            hits = 0, sampleX = x, sampleY = y,
          }
          seen[key] = entry
          out.highlights[#out.highlights + 1] = entry
        end
        entry.hits = entry.hits + 1
      end
    end
  end
  return out
end

SLASH_ZONEHIGHLIGHTDUMP1 = "/zonedump"
SlashCmdList.ZONEHIGHLIGHTDUMP = function()
  local result = { build = { GetBuildInfo() }, continents = {} }
  for id = 1, 3000 do
    local info = C_Map.GetMapInfo(id)
    if info and info.mapType == Enum.UIMapType.Continent then
      local ok, data = pcall(dumpContinent, info)
      if ok then
        result.continents[#result.continents + 1] = data
        print(("Zone Highlight Dump: %s (map %d): %d highlights, %d zones"):format(info.name, id, #data.highlights, #data.zones))
      else
        print(("Zone Highlight Dump: %s (map %d) failed: %s"):format(info.name, id, tostring(data)))
      end
    end
  end
  ZoneHighlightDumpDB = result
  print("Zone Highlight Dump: done. Type /reload to save the result to disk.")
end
