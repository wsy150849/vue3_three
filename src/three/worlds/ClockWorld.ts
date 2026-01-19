import * as THREE from 'three'
import type { IWorld } from './IWorld'
import { Experience } from '../core/Experience'
import { GeometryEntity } from '../entities/GeometryEntity'
import { RotationSystem } from '../systems/RotationSystem'

export class ClockWorld implements IWorld {
    private exp?: Experience
    private entities: GeometryEntity[] = []
    private root = new THREE.Group()
    bodyGroup = new THREE.Group()
    pointerGroup = new THREE.Group()
    hourHandGroup = new THREE.Group()
    minuteHandGroup = new THREE.Group()
    secondHandGroup = new THREE.Group()

    setExperience(experience: Experience): void {
        this.exp = experience
    }

    async enter(): Promise<void> {
        if (!this.exp) return;
        this.exp.scene.add(this.root)
        this.exp.scene.background = new THREE.Color(0xAAAAAA);
        /**
         * 光
         * 时钟
         * 表盘
         * 刻度
         * 指针
         * 时针
         * 分针
         * 秒针
         *  */
        const helper = new THREE.AxesHelper(10)
        // this.root.add(helper)

        // 添加光源
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(0, 0, 10)
        light.target.position.set(0, 0, 0)
        this.root.add(light)
        this.root.add(light.target)

        //#region 时钟
        // 表盘
        const dial = new GeometryEntity(
            { type: 'circle', size: { radius: 10 } },
            { type: 'standard', color: 0xffffff, side: THREE.DoubleSide },
            { size: 1, status: false },
            'dial'
        )
        dial.enter(this.bodyGroup)
        dial.group.position.set(0, 0, 0)

        const dialBorder = new GeometryEntity(
            { type: 'circle', size: { radius: 11 } },
            { type: 'standard', color: 0x000000, roughness: 1, side: THREE.DoubleSide },
            { size: 1, status: false },
            'dialBorder'
        )
        dialBorder.enter(this.bodyGroup)
        dialBorder.group.position.set(0, 0, -0.01)

        // 刻度
        const tickGroup = new THREE.Group()
        for (let i = 0; i < 12; i++) {
            const tick = new GeometryEntity(
                { type: 'text', size: { text: `${i === 0 ? 12 : i}`, size: 1, depth: 0.1, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 5 } },
                { type: 'standard', color: 0x000000, side: THREE.DoubleSide },
                { size: 1, status: false },
                'tick' + i
            )
            tick.enter(tickGroup)

            // 计算刻度在圆周上的位置
            // 角度：12点方向是 90度，每小时 30度 (360/12)
            // i=0 时显示 12，角度 -90度；i=1 时显示 1，角度 -60度
            const angle = (Math.PI / 6) * i - Math.PI / 2
            const radius = 8 // 距离中心的距离
            if (i === 0 || i === 10 || i === 11) {
                tick.group.position.x = Math.cos(angle) * radius - 0.5
                tick.group.position.y = -Math.sin(angle) * radius
            } else {
                tick.group.position.x = Math.cos(angle) * radius
                tick.group.position.y = -Math.sin(angle) * radius
            }
            this.entities.push(tick)
        }

        // 添加到 entities 数组以便清理
        this.entities.push(dial, dialBorder)

        this.bodyGroup.position.set(0, 0, 0)
        this.root.add(this.bodyGroup)
        tickGroup.position.set(-0.5, -0.5, 0.06)
        this.root.add(tickGroup)
        //#endregion

        //#region 指针
        // 时针
        const hourHand = new GeometryEntity(
            { type: 'box', size: { width: 0.15, height: 3, depth: 0.15 } },
            { type: 'standard', color: 0x000000 },
            { size: 1, status: false },
            'hourHand'
        )
        hourHand.enter(this.hourHandGroup)
        hourHand.group.position.set(0, 1.4, 0.15)
        this.entities.push(hourHand)
        
        const hourHandHead = new GeometryEntity(
            { type: 'cone', size: { radius: 0.15, height: 0.6, radialSegments: 4 } },
            { type: 'standard', color: 0x000000 },
            { size: 1, status: false },
            'hourHandHead'
        )
        hourHandHead.enter(this.hourHandGroup)
        hourHandHead.group.position.set(0, 3.2, 0.15)
        this.entities.push(hourHandHead)
        this.hourHandGroup.position.set(0, 0, 0)
        this.pointerGroup.add(this.hourHandGroup)

        // 秒针
        const secondHand = new GeometryEntity(
            { type: 'box', size: { width: 0.15, height: 6, depth: 0.15, widthSegments: 10, heightSegments: 10 } },
            { type: 'standard', color: 0x00ff00 },
            { size: 1, status: false },
            'secondHand'
        )
        secondHand.enter(this.secondHandGroup)
        secondHand.group.position.set(0, 2.9, 0.45)
        this.entities.push(secondHand)
        
        const secondHandHead = new GeometryEntity(
            { type: 'cone', size: { radius: 0.15, height: 0.6, radialSegments: 4 } },
            { type: 'standard', color: 0x00ff00 },
            { size: 1, status: false },
            'secondHandHead'
        )
        secondHandHead.enter(this.secondHandGroup)
        secondHandHead.group.position.set(0, 6.2, 0.45)
        this.entities.push(secondHandHead)
        this.secondHandGroup.position.set(0, 0, 0)
        this.pointerGroup.add(this.secondHandGroup)

        // 分针
        const minuteHand = new GeometryEntity(
            { type: 'box', size: { width: 0.15, height: 5, depth: 0.15, widthSegments: 10, heightSegments: 10 } },
            { type: 'standard', color: 0x0000ff },
            { size: 1, status: false },
            'minuteHand'
        )
        minuteHand.enter(this.minuteHandGroup)
        minuteHand.group.position.set(0, 2.4, 0.30)
        this.entities.push(minuteHand)
        
        const minutHandHead = new GeometryEntity(
            { type: 'cone', size: { radius: 0.15, height: 0.6, radialSegments: 4 } },
            { type: 'standard', color: 0x0000ff },
            { size: 1, status: false },
            'minuteHandHead'
        )
        minutHandHead.enter(this.minuteHandGroup)
        minutHandHead.group.position.set(0, 5.2, 0.30)
        this.entities.push(minutHandHead)
        this.minuteHandGroup.position.set(0, 0, 0)
        this.pointerGroup.add(this.minuteHandGroup)

        this.root.add(this.pointerGroup)
        //#endregion
    }


    update(dt: number): void {
        if (!this.exp) return
        // 获取真实时间的指针角度
        const angles = this.exp.time?.getClockAngles()
        if (angles) {
            // 取负值实现顺时针旋转（Three.js 中 rotation.z 正值是逆时针）
            this.hourHandGroup.rotation.z = -angles.hours
            this.minuteHandGroup.rotation.z = -angles.minutes
            this.secondHandGroup.rotation.z = -angles.seconds
        }
    }

    exit(): void {
        this.entities.forEach(e => e.exit())
        if (this.exp) {
            this.exp.scene.remove(this.root)
        }
    }
}