import { Sources, SourceInputType, Cutouts, Outputs, OutputType, Settings } from '../server/api'

const sources: Sources = {
	caspar: {
		title: 'Source A',
		width: 1280,
		height: 720,
		rotation: 0,
		input: {
			type: SourceInputType.MEDIA,
			file: 'amb'
		}
	},
	head: {
		title: 'Source B',
		width: 1280,
		height: 720,
		rotation: 90,
		input: {
			type: SourceInputType.MEDIA,
			file: 'go1080p25'
		}
	}
}

const cutouts: Cutouts = {
	casparfull: {
		source: 'caspar',
		x: 0,
		y: 0,
		width: 1280,
		height: 720,
		outputRotation: 0
	},
	casparzoom: {
		source: 'caspar',
		x: 250,
		y: 150,
		width: 720,
		height: 405,
		outputRotation: 0
	},
	head: {
		source: 'head',
		x: 0,
		y: 0,
		width: 1280,
		height: 720,
		outputRotation: 90
	},
	headsquare: {
		source: 'head',
		x: 0,
		y: 0,
		width: 1280,
		height: 720,
		outputRotation: 0
	}
}

const outputs: Outputs = [
	{
		type: OutputType.CUTOUT,
		casparChannel: 0,
		width: 1280,
		height: 720,
		cutout: {
			cutoutId: 'head',
			x: 0,
			y: 0,
			scale: 1
		}
	},
	{
		type: OutputType.MULTIVIEW,
		cutouts: [
			{
				cutoutId: 'casparfull',
				x: -400,
				y: -200,
				scale: 0.25
			},
			{
				cutoutId: 'casparzoom',
				x: 0,
				y: -200,
				scale: 0.25
			},
			{
				cutoutId: 'head',
				x: -400,
				y: 100,
				scale: 0.25
			},
			{
				cutoutId: 'headsquare',
				x: 0,
				y: 100,
				scale: 0.25
			}
		],
		casparChannel: 2,
		width: 1280,
		height: 720
	}
]

const settings: Settings = {
	channelForRoutes: 1,
	channelForRoutesStartLayer: 900,
	casparCG: {
		hostname: '160.67.52.144',
		port: 5250
	},
	imageProvider: {
		hostname: '160.67.52.144',
		port: 5255,
		protocol: 'http'
	},
	stream: {
		channel: 2,
		streamId: 99,
		streamUri: 'rtmp://<user>:<password>@nrkhd-rtmp-in1.netwerk.no:1934/live/stream-159586_1',
		streamParams:
			'-codec:v libx264 -filter:v "scale=out_range=full,fps=25,format=yuv420p,setsar=1:1,setdar=1:1" -profile:v high -level:v 3.2 -g 50 -preset fast -tune fastdecode -crf 18 -maxrate 2.5M -bufsize 1.5M -codec:a aac -b:a 160k -f flv'
	},
	ui: {
		inputJitterCutoff: 2
	}
}
