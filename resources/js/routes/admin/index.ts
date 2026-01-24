import userManagement from './user-management'
import users from './users'
import health from './health'
import telemetry from './telemetry'
import logs from './logs'
import artisan from './artisan'
import queue from './queue'
const admin = {
    userManagement: Object.assign(userManagement, userManagement),
users: Object.assign(users, users),
health: Object.assign(health, health),
telemetry: Object.assign(telemetry, telemetry),
logs: Object.assign(logs, logs),
artisan: Object.assign(artisan, artisan),
queue: Object.assign(queue, queue),
}

export default admin