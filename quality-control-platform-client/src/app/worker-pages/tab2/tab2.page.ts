import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import SignaturePad from 'signature_pad';
import { ItemsService } from '../../services/items.service';
import { Items } from '../../models/dtos/items';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';

import { finalize } from 'rxjs/operators';
import { Reports } from '../../models/dtos/reports';
import { ReportsService } from '../../services/reports.service';
import { DamageType } from '../../models/enums/damage-type';
import {
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Workers } from '../../models/dtos/workers';
import { WorkersService } from '../../services/workers.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  currentUser: User;
  currentWorker: Workers;
  private report: Reports = {
    creationDate: new Date(),
    archivingDate: null,
    description: '',
    photosPath: '',
    signature: '',
    damageType: null,
    decision: null,
    reportAcceptance: 0,
    isArchived: false,
    itemId: null,
    workerId: null,
  };

  // CANVAS
  private signaturePad: any;
  private uploadedSignaturePhotoPath: string;
  private signaturePhotoName: string;

  // PHOTO
  private uploadedReportPhotoPath: string;
  private reportPhotoName: string;
  private fireUploadTask: AngularFireUploadTask;
  private base64Photo = null;
  private reportForm: FormGroup;

  constructor(
    private elementRef: ElementRef,
    private itemsService: ItemsService,
    private reportsService: ReportsService,
    private authService: AuthService,
    private workersService: WorkersService,
    private formBuilder: FormBuilder,
    private angularFireStorage: AngularFireStorage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private datePipe: DatePipe
  ) {}

  @HostListener('window:resize', ['$event'])
  private onResize() {
    this.initCanvas();
  }

  public damageTypeKeys(): Array<string> {
    const keys = Object.keys(DamageType);
    return keys.slice(keys.length / 2);
  }

  ngOnInit(): void {
    this.itemsService
      .getItems()
      .subscribe((response: Items[]) => (this.itemsService.items = response));
    this.authService
      .getCurrentUser()
      .subscribe((response) => (this.currentUser = response));
    this.getAllReports();

    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
    this.signaturePad.penColor = 'rgb(55,128,255)';
    this.initCanvas();

    this.reportForm = this.formBuilder.group({
      _damageType: new FormControl(null, Validators.required),
      _description: new FormControl(null),
      _photosPath: new FormControl(null, Validators.required),
      _signature: new FormControl(null),
      _itemId: new FormControl(null, Validators.required),
    });
  }

  private getAllReports(): void {
    this.reportsService
      .getReports()
      .subscribe(
        (response: Reports[]) => (this.reportsService.reports = response)
      );
  }

  private async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    this.base64Photo = image.base64String;
    // this.photoPreview = `data:image/jpeg;base64,${this.base64Photo}`;

    this.reportPhotoName =
      this.datePipe.transform(new Date(), 'YYYY-MM-dd_HH:mm:ss') +
      '__' +
      this.currentUser.uid;
    const fileStoragePath = `photos/${this.reportPhotoName}`;
    const imageFireStorageReference =
      this.angularFireStorage.ref(fileStoragePath);
    this.fireUploadTask = this.angularFireStorage
      .ref(fileStoragePath)
      .putString(this.base64Photo, 'base64', { contentType: 'image/png' });
    this.fireUploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          const downloadURL = imageFireStorageReference.getDownloadURL();
          downloadURL.subscribe(async (url) => {
            if (url) {
              this.uploadedSignaturePhotoPath = url;
              this.reportForm
                .get('_signature') // TODO reportphoto
                .setValue(this.uploadedSignaturePhotoPath);
            }
          });
        })
      )
      .subscribe();
  }

  private async uploadReportPhoto(event: FileList) {
    const loading = await this.loadingController.create();
    await loading.present();

    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('Ten typ pliku nie jest wspierany!');
      return;
    }

    this.reportPhotoName =
      this.datePipe.transform(new Date(), 'YYYY-MM-dd_HH:mm:ss') +
      '__' +
      this.currentUser.uid;
    const fireStoragePath = `reportPhotos/${this.reportPhotoName}`;
    const imageFireStorageReference =
      this.angularFireStorage.ref(fireStoragePath);
    this.fireUploadTask = this.angularFireStorage.upload(fireStoragePath, file);
    this.fireUploadTask
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadURL = imageFireStorageReference.getDownloadURL();
          downloadURL.subscribe((url) => {
            if (url) {
              this.uploadedReportPhotoPath = url;
              this.reportForm
                .get('_photosPath')
                .setValue(this.uploadedReportPhotoPath);
            }
          });
          await loading.dismiss();
        })
      )
      .subscribe();
  }

  private initCanvas() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 600; // -140
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }

  private isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  private clearCanvas() {
    this.signaturePad.clear();
  }

  private undoCanvas() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  // FIXME naprawić problem z dwuklikiem przycisku/pustym formularzem dla signature

  // eslint-disable-next-line no-trailing-spaces
  
  private async saveCanvas() {
    const loading = await this.loadingController.create();
    await loading.present();
    const signature = this.signaturePad.toDataURL().slice(22);
    this.signaturePhotoName =
      this.datePipe.transform(new Date(), 'YYYY-MM-dd_HH:mm:ss') +
      '__' +
      this.currentUser.uid;
    const fileStoragePath = `signatures/${this.signaturePhotoName}`;
    const imageFireStorageReference = this.angularFireStorage.ref(fileStoragePath);
    this.fireUploadTask = imageFireStorageReference
      .putString(signature, 'base64', { contentType: 'image/png' });
    this.fireUploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          const downloadURL = imageFireStorageReference.getDownloadURL();
          downloadURL.subscribe(async (url) => {
            if (url) {
              this.uploadedSignaturePhotoPath = url;
              this.reportForm
                .get('_signature')
                .setValue(this.uploadedSignaturePhotoPath);
              await loading.dismiss();
            }
          });
        })
      )
      .subscribe();
  }

  private async onSubmit() {
    const alertSignatureNotUploaded = await this.alertController.create({
      header: 'Prześlij podpis!',
      message: 'Pamiętaj o przesłaniu podpisu przed zatwierdzeniem formularza.',
      buttons: ['OK'],
    });

    if (!this.isCanvasBlank()) {
      this.saveCanvas().then(() => {
        if (this.reportForm.valid) {
          if (this.report.signature !== '') {
            this.report.workerId = this.workersService.workers.find(
              (response: Workers) =>
                this.currentUser.uid === response.identityNumber
            ).workerId;
            this.report.signature = this.uploadedSignaturePhotoPath;
            this.report.photosPath = this.uploadedReportPhotoPath;
            this.reportsService
              .postReport(this.report)
              .subscribe((response) => {
                this.getAllReports();
                console.log(response);
              });
          } else {
            alertSignatureNotUploaded.present();
          }
        }
      });
    } else {
      alertSignatureNotUploaded.present();
    }
  }
}
