import 'promise'
import * as fs from 'fs'
import * as request from 'request'
import { permuteDomain } from 'tough-cookie'
import { rejects } from 'assert'

const year = 2018
const prefix = 'http://www.arocmag.com/article/01'

const allToLen = (num, length) => (new Array(length).join('0') + num).slice(-length)

const reqPromise = (mon, pid) => {

    const url = `${prefix}-${year}-${allToLen(mon, 2)}-`

    return new Promise((resolve, reject) => {
        request(`${url}${allToLen(pid, 3)}.html`, {}, async (error, response, body) => {

            if (error) {
                console.log(error)
            }

            let content = body
            if (body.includes('404')) {
                resolve(false)
            } else {
                const pdfId = content.split('/getarticle?aid=')[1].slice(0, 16)
                request(`http://www.arocmag.com/getarticle?aid=${pdfId}`).pipe(fs.createWriteStream(`./paper_2018/${mon}-${pid}.pdf`))
                resolve(true)
            }
        })
    })
}

(async () => {
    for (let mon = 1; mon < 13; mon++) {
        for (let i = 1; ; i++) {
            const res = await reqPromise(mon, i)
            if (!res) break
        }
    }
})()