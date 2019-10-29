import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CropperComponent } from "angular-cropperjs";
import { AddService } from "../add.service";

@Component({
  selector: "ngbd-cropper-modal",
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
      ></div>
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
  `
})
export class NgbdCropperModal {
  @ViewChild("angularCropper", { static: false })
  angularCropper: CropperComponent;

  // CropperJS
  imageUrl: any;
  croppedImg: any;
  config = {
    responsive: true,
    aspectRatio: 16 / 9,
    zoomable: true,
    zoomOnWheel: true
  };

  constructor(
    public activeModal: NgbActiveModal,
    private addService: AddService
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

    this.addService.imageUrl = "";
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imageUrl = reader.result;
      this.addService.imageUrl = reader.result;
    };
  }

  save() {
    this.activeModal.dismiss(
      this.angularCropper.cropper.getCroppedCanvas().toDataURL()
    );
  }
}

@Component({
  selector: "app-add-img",
  templateUrl: "./add-img.component.html",
  styleUrls: ["./add-img.component.scss"]
})
export class AddImgComponent implements OnInit {
  croppedImg: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  async open() {
    await this.modalService.open(NgbdCropperModal).result.then(
      _ => {},
      reason => {
        if (reason !== "Cross click") {
          this.croppedImg = reason;
        }
      }
    );
  }
}
