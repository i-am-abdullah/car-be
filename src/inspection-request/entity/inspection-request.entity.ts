import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { CarListing } from 'src/car-listings/car-listing.entity';
import { User } from 'src/users/entities/user.entity';
import { InspectionPackage } from 'src/inspection-packages/entity/inspection-packages.entity';
import { InspectionReport } from 'src/inspection-report/entity/inspection-report.entity';

export enum InspectionRequestStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_ADVANCE_PAYMENT = 'pending_advance_payment',
  ADVANCE_PAID = 'advance_paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

@Entity('inspection_requests')
export class InspectionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requested_date', type: 'timestamp', nullable: false })
  requestedDate: Date;

  @Column({ name: 'scheduled_date', type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column({ name: 'completion_date', type: 'timestamp', nullable: true })
  completionDate: Date;

  @Column({ length: 255, nullable: false })
  location: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone: string;

  @Column({
    type: 'enum',
    enum: InspectionRequestStatus,
    default: InspectionRequestStatus.PENDING_APPROVAL
  })
  status: InspectionRequestStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalPrice: number;

  @Column({
    name: 'advance_payment_status',
    type: 'enum',
    enum: PaymentStatus,
    nullable: true
  })
  advancePaymentStatus: PaymentStatus;

  @Column({
    name: 'total_payment_status',
    type: 'enum',
    enum: PaymentStatus,
    nullable: true
  })
  totalPaymentStatus: PaymentStatus;

  @Column({ name: 'full_payment_date', type: 'timestamp', nullable: true })
  fullPaymentDate: Date;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @Column({ name: 'user_notes', type: 'text', nullable: true })
  userNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CarListing, carListing => carListing.inspectionRequests)
  @JoinColumn({ name: 'listing_id' })
  listing: CarListing;

  @ManyToOne(() => User, user => user.inspectionRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => InspectionPackage, inspectionPackage => inspectionPackage.inspectionRequests)
  @JoinColumn({ name: 'package_id' })
  package: InspectionPackage;

@OneToOne(() => InspectionReport, request => request.inspectionRequest)
@JoinColumn({ name: 'inspection_report_id' })
inspectionReport: InspectionReport;
}