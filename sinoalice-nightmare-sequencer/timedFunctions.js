const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const utility = require('./new_utils')


module.exports = 
{
    scheduleUpdates,
    schedulePing
}

function scheduleUpdates()
{
    const scheduler = new ToadScheduler()

    const task = new Task('Update Database', () => { utility.updateDatabase() })
    const job = new SimpleIntervalJob({ days: 1, }, task)

    scheduler.addSimpleIntervalJob(job)

    console.log('Updating job scheduled daily successfully')
    // when stopping your app
    //scheduler.stop()
}

function schedulePing()
{
    const scheduler = new ToadScheduler()

    const task = new Task('Ping Database', () => { utility.pingDatabase() })
    const job = new SimpleIntervalJob({ days: 1, }, task)

    scheduler.addSimpleIntervalJob(job)

    console.log('Daily ping scheduled daily successfully')
}