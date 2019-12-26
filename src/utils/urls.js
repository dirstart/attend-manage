// 获取城市
export const cityPicker = '/offers/city'

// 获取三字码
export const cityInfo = '/mobile-starter/api/v1/city/getCity'
// 获取航班
export const flightList = '/mobile-starter/api/v1/FlightDynamic/marketingFlight?flightNo={FLIGHTNO}&departureDate={DEPARTUREDATE}'

// 现场赔付
export const saveCompensateFlight = '/compensate/addFlightCompensateInfo'
export const addFlightCompensateInfoBatch = '/compensate/addFlightCompensateInfoBatch'
export const updateFlightCompensateInfo = '/compensate/updateFlightCompensateInfo'

export const getCompensateFlight = '/compensate/getFlightCompensateInfo/{PAGE}/{SIZE}'

export const getPsgCompensateInfo = '/compensate/getPsgCompensateInfo/{PAGE}/{SIZE}'
export const addPsgCompensateInfoBatch = '/compensate/addPsgCompensateInfoBatch'

export const getUserSponsorFlow = '/compensate/getUserSponsorFlow/{PAGE}/{SIZE}'
export const getUserHandleFlow = '/compensate/getWorkFlowInfo/{PAGE}/{SIZE}'

export const getWorkFlowByFlightId = '/compensate/getWorkFlowByFlightId'
export const judgeUserCanApprove = '/compensate/judgeUserCanApprove'
export const getCurrentNodesInfo = '/compensate/getCurrentNodesInfo'

export const approveProcess = '/compensate/approveProcess'

export const lbpmDockingMain = '/bpm/sys/lbpmdocking/lbpm_docking_main/lbpmDockingMain.do?method=showProcess&sysId={SYSID}&modelId={MODELID}&templateFormId={TEMPLATEFORMID}&formInstanceId={FORMINSTANCEID}'