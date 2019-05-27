/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit-element';
import { $needsRender, $scene, $tick } from '../model-viewer-base.js';
const Alignment = {
    CENTER: 'center',
    ORIGIN: 'origin'
};
// How much the model will rotate per
// second in radians:
const ROTATION_SPEED = Math.PI / 32;
const UNBOUNDED_WHITESPACE_RE = /\s+/;
const alignmentToMaskValues = (alignmentString) => {
    const alignments = alignmentString.split(UNBOUNDED_WHITESPACE_RE);
    const maskValues = [];
    let firstAlignment;
    for (let i = 0; i < 3; ++i) {
        const alignment = alignments[i];
        if (alignment != null && firstAlignment == null) {
            firstAlignment = alignment;
        }
        switch (alignment || firstAlignment) {
            default:
            case Alignment.CENTER:
                maskValues.push(1.0);
                break;
            case Alignment.ORIGIN:
                maskValues.push(0.0);
                break;
        }
    }
    return maskValues;
};
const $updateAlignment = Symbol('updateAlignment');
export const StagingMixin = (ModelViewerElement) => {
    class StagingModelViewerElement extends ModelViewerElement {
        constructor() {
            super(...arguments);
            this.autoRotate = false;
            this.alignModel = 'center';
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has('alignModel')) {
                this[$updateAlignment]();
            }
            if (changedProperties.has('autoRotate')) {
                this[$scene].pivot.rotation.set(0, 0, 0);
                this[$needsRender]();
            }
        }
        [$tick](time, delta) {
            super[$tick](time, delta);
            if (this.autoRotate && this.modelIsVisible) {
                this[$scene].pivot.rotation.y +=
                    ROTATION_SPEED * delta * 0.001;
                this[$needsRender]();
            }
        }
        [$updateAlignment]() {
            const { alignModel } = this;
            const alignmentMaskValues = alignmentToMaskValues(alignModel);
            this[$scene].setModelAlignmentMask(...alignmentMaskValues);
        }
        get turntableRotation() {
            return this[$scene].pivot.rotation.y;
        }
    }
    __decorate([
        property({ type: Boolean, attribute: 'auto-rotate' })
    ], StagingModelViewerElement.prototype, "autoRotate", void 0);
    __decorate([
        property({ type: String, attribute: 'align-model' })
    ], StagingModelViewerElement.prototype, "alignModel", void 0);
    return StagingModelViewerElement;
};
//# sourceMappingURL=staging.js.map