/*
 * @Author: your name
 * @Date: 2021-07-08 23:40:31
 * @LastEditTime: 2021-07-19 20:47:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \screeps\dist\main.js
 */
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');

module.exports.loop = function () {


    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 自动孵化repair
    var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');

    if (repairs.length < 3) {
        var newName = 'Repair' + Game.time;
        console.log('Spawning new repair: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
            memory: {
                role: 'repair'
            }
        });
    }

    // 自动孵化builder
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if (builders.length < 1) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'builder'
            }
        });
    }

    // 自动孵化upgrader
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if (upgraders.length < 3) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: {
                role: 'upgrader'
            }
        });
    }

    // 自动孵化harvester
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    if (harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, {
            memory: {
                role: 'harvester'
            }
        });
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y, {
                align: 'left',
                opacity: 0.8
            });
    }

    var tower = Game.getObjectById('60eb4150fd2b7c86eebb0702');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
    }
}