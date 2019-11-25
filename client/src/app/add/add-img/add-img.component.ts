import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperComponent } from 'angular-cropperjs';
import { AddService } from '../add.service';
import { ActivatedRoute } from '@angular/router';
import { Meal } from 'src/app/models/repas.model';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BaseComponent } from 'src/app/base/base.component';
import { MealService } from 'src/app/meal.service';

@Component({
  selector: 'ngbd-cropper-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Choisir une image</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div
        *ngIf="!imageUrl"
        class="img-thumbnail"
        style="height: 150px; width; 150px;"
      >
        <div class="d-flex justify-content-center align-items-center h-100">
          <h5>Image ici</h5>
        </div>
      </div>
      <angular-cropper
        *ngIf="imageUrl"
        #angularCropper
        [cropperOptions]="config"
        [imageUrl]="imageUrl"
      ></angular-cropper>
    </div>
    <div class="modal-footer">
      <input
        type="file"
        accept="image/*"
        #file
        [hidden]="true"
        (change)="upload(file.files)"
      />
      <div class="w-100 d-flex justify-content-between">
        <button class="btn btn-info" (click)="file.click()">Choisir</button>
        <button type="button" class="btn btn-success" (click)="save()">
          Sauvegarder
        </button>
      </div>
    </div>
  `,
})
export class NgbdCropperModal {
  @ViewChild('angularCropper', { static: false })
  angularCropper: CropperComponent;

  // CropperJS
  imageUrl: any;
  croppedImg: any;
  config = {
    responsive: true,
    aspectRatio: 16 / 9,
    zoomable: true,
    zoomOnWheel: true,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private addService: AddService,
  ) {
    this.imageUrl = this.addService.imageUrl;
  }

  upload(files) {
    if (this.angularCropper) {
      this.angularCropper.cropper.destroy();
    }
    if (files.length === 0) return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    this.addService.imageUrl = '';
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imageUrl = reader.result;
      this.addService.imageUrl = reader.result;
    };
  }

  save() {
    this.activeModal.dismiss(
      this.angularCropper.cropper
        .getCroppedCanvas()
        .toDataURL('image/jpeg', 1 / 100),
    );
  }
}

@Component({
  selector: 'app-add-img',
  templateUrl: './add-img.component.html',
  styleUrls: ['./add-img.component.scss'],
})
export class AddImgComponent extends BaseComponent implements OnInit {
  @ViewChild('angularCropper', { static: false })
  @Input()
  meal: Meal;

  angularCropper: CropperComponent;

  croppedImg: string;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private mealService: MealService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.mealService.meals$
        .pipe(takeUntil(this.destroy$))
        .subscribe((meals: Meal[]) => {
          const { id, type } = this.route.snapshot.params;
          const meal = meals.filter(
            meal => +meal.id === +id && +meal.type === +type,
          );
          if (meal.length > 0) {
            this.meal = meal[0];
            if (this.meal.image) {
              this.croppedImg = this.meal.image;
            } else {
              this.croppedImg = '';
            }
            this.cdr.detectChanges();
          }
        });
    }
  }

  async open() {
    await this.modalService.open(NgbdCropperModal).result.then(
      _ => {},
      reason => {
        if (reason !== 'Cross click') {
          this.croppedImg = reason;
        }
      },
    );
  }

  delete(): void {
    this.croppedImg = '';
  }
}
