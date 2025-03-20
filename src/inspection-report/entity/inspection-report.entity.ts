import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    JoinColumn,
    OneToOne
  } from 'typeorm';
  import { InspectionRequest } from 'src/inspection-request/entity/inspection-request.entity';
  
  @Entity('inspection_reports')
  export class InspectionReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 50 })
    overall_condition: string;
  
    @Column({ type: 'decimal', precision: 3, scale: 1 })
    condition_rating: number;
  
    @Column({ type: 'text' })
    exterior_assessment: string;
  
    @Column({ type: 'text' })
    interior_assessment: string;
  
    @Column({ type: 'text' })
    mechanical_assessment: string;
  
    @Column({ type: 'text' })
    electrical_assessment: string;
  
    @Column({ type: 'integer' })
    odometer_reading: number;
  
    @Column({ type: 'boolean', default: false })
    vin_verified: boolean;
  
    @Column({ type: 'text' })
    inspector_comments: string;
  
    @Column({ type: 'text' })
    recommended_actions: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    estimated_repair_costs: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => InspectionRequest, request => request.inspectionReport, { nullable: false })
    @JoinColumn({ name: 'inspection_request_id' })
    inspectionRequest: InspectionRequest;
  }