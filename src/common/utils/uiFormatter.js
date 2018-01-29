
export function getShortAddress(address){
	if(typeof address == 'string'){
		return address.slice(0,4)+'...'+address.slice(-4)
	}else{
		throw new Error('address must be string')
	}
}

export default {
	getShortAddress
}