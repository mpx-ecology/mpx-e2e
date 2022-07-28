import { pushExpect } from './utils'

function initExpect ():any {
  try {
    const oldexpect = expect
  
    expect = function (...args: any[]) {
      pushExpect()
      return oldexpect(...args)
    }
  } catch (error) {
    console.log(error)
  }
}

export default initExpect
