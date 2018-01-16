import moment from 'moment'

export function toLrcFee(value){
	return (Number(value)/1e18).toFixed(6)
}
export function toTimestamp(value){
	return moment(value).format('YYYY/MM/DD hh:mm:ss')
}
