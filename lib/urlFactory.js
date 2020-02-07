export function getProtooUrl({media_server_wss, roomId, peerId, forceH264, forceVP9 })
{	
	if (!media_server_wss) console.error("config.media_server_wss don't set.")

	let url = `${media_server_wss}/?roomId=${roomId}&peerId=${peerId}`;

	if (forceH264)
		url = `${url}&forceH264=true`;
	else if (forceVP9)
		url = `${url}&forceVP9=true`;

	return url;
}
