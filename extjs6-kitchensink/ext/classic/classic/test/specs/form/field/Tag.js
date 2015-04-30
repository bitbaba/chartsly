describe("Ext.form.field.Tag", function() {

    var tagField, store, changeSpy,
        describeNotIE9_10 = Ext.isIE9 || Ext.isIE10 ? xdescribe : describe;

    var Model = Ext.define(null, {
        extend: 'Ext.data.Model',
        fields: ['display', 'value']
    });

    // There's no simple way to simulate user typing, so going
    // to reach in too far here to call this method. Not ideal, but
    // the infrastructure to get typing simulation is fairly large
    function doTyping(value, isBackspace) {
        tagField.inputEl.dom.value = value;
        tagField.onFieldMutation({
            type: 'change',
            getKey: function() {
                return isBackspace ? Ext.event.Event.DELETE : 0;
            },
            isSpecialKey: function() {
                return !!isBackspace;
            },
            // Need these two properties so that this object quacks
            // in correct ways to onFieldMutation.
            DELETE: Ext.event.Event.DELETE,
            BACKSPACE: Ext.event.Event.BACKSPACE
        });
    }

    function fireInputKey(key, shift, ctrl) {
        tagField.inputEl.dom.focus;
        jasmine.fireKeyEvent(tagField.inputEl.dom, 'keydown', key, shift, ctrl);
    }

    function clickTag(id, isClose) {
        var tag = getTag(id);
        if (isClose) {
            tag = Ext.fly(tag).down(tagField.tagItemCloseSelector, true);
        }
        jasmine.fireMouseEvent(tag, 'click');
    }

    function makeData(rows) {
        var data = [],
            i;

        for (i = 1; i <= rows; ++i) {
            data.push({
                display: 'Item' + i,
                value: i
            });
        }
        return data;
    }

    function makeStore(data, id) {
        if (!data) {
            data = 20;
        }

        if (Ext.isNumber(data)) {
            data = makeData(data);
        }
        return new Ext.data.Store({
            model: Model,
            data: data,
            storeId: id
        });
    }

    function makeField(cfg, theStore) {
        if (theStore !== null) {
            store = theStore || makeStore();
        }
        tagField = new Ext.form.field.Tag(Ext.apply({
            store: store,
            renderTo: Ext.getBody(),
            displayField: 'display',
            valueField: 'value',
            queryMode: 'local'
        }, cfg));
    }

    function makeFieldWithSpy(cfg, theStore) {
        makeField(cfg, theStore);
        setupChangeSpy();
    }

    function expectValue(values) {
        var tags = tagField.getEl().query(tagField.tagItemSelector);
        expect(tagField.getValue()).toEqual(values);
        expect(tags.length).toBe(values.length);
        Ext.Array.forEach(values, function(value, i) {
            // Use toEqual here because the tag itself is pushed into the DOM
            expect(tags[i].getAttribute('data-value')).toBe('' + value);
        });
    }

    function getTag(id) {
        var tags = tagField.getEl().query(tagField.tagItemSelector),
            len = tags.length,
            tag, i;

        for (i = 0; i < len; ++i) {
            tag = tags[i];
            if (tag.getAttribute('data-value') == id) {
                return tag;
            }
        }
    }

    function expectChange(newValue, oldValue, callCount) {
        callCount = callCount || 1;
        oldValue = oldValue || [];
        expect(changeSpy.callCount).toBe(callCount);
        expect(changeSpy.mostRecentCall.args[1]).toEqual(newValue);
        expect(changeSpy.mostRecentCall.args[2]).toEqual(oldValue);
    }

    function setupChangeSpy() {
        changeSpy = jasmine.createSpy();
        tagField.on('change', changeSpy);
    }

    function clickListItem(rec) {
        tagField.expand();
        var node = tagField.getPicker().getNode(rec);
        jasmine.fireMouseEvent(node, 'click');
    }

    afterEach(function() {
        Ext.destroy(tagField, store);
        tagField = store = null;
    });

    describe("the store", function() {
        it("should be able to be created without a store", function() {
            makeField(null, null);
        });

        it("should accept a store instance", function() {
            var s = makeStore();
            makeField(null, s);
            expect(tagField.getStore()).toBe(s);
        });

        it("should accept a store config", function() {
            makeField({
                store: {
                    model: Model,
                    data: [{}]
                }
            }, null);
            expect(tagField.getStore().getCount()).toBe(1);
            // So it gets destroyed
            store = tagField.getStore();
        });

        it("should accept a store id", function() {
            store = makeStore(1, 'foo');
            makeField({
                store: 'foo'
            }, null);
            expect(tagField.getStore()).toBe(store);
        });
    });

    describe("setting values", function() {
        describe("configuring with a value", function() {
            it("should return an empty array if no value is configured", function() {
                makeField();
                expectValue([]);
            });

            it("should return an empty array if value is configured as null", function() {
                makeField({
                    value: null
                });
                expectValue([]);
            });

            it("should accept a single value", function() {
                makeField({
                    value: 3
                });
                expectValue([3]);
            });

            it("should accept an array of values", function() {
                makeField({
                    value: [2, 5, 11]
                });
                expectValue([2, 5, 11]);
            });

            it("should accept a single record", function() {
                var s = makeStore();
                makeField({
                    value: s.getAt(9)
                }, s);
                expectValue([10]);
            });

            it("should accept an array of records", function() {
                var s = makeStore();
                makeField({
                    value: [s.getAt(4), s.getAt(8), s.getAt(13)]
                }, s);
                expectValue([5, 9, 14]);
            });

            it("should retain the order", function() {
                makeField({
                    value: [10, 6, 8, 7, 4, 5]
                });
                expectValue([10, 6, 8, 7, 4, 5]);
            });
        });

        describe("viewmodel", function() {
            it("should be able to set the value via the viewmodel", function() {
                var vm = new Ext.app.ViewModel({
                    data: {
                        value: [1, 2]
                    }
                });
                makeField({
                    viewModel: vm,
                    bind: '{value}'
                });
                vm.notify();
                expectValue([1, 2]);
            });
        });

        describe("setValue", function() {
            it("should be empty when setting to null", function() {
                makeFieldWithSpy();
                tagField.setValue(null);
                expectValue([]);
                expect(changeSpy).not.toHaveBeenCalled();
            });

            it("should clear a value when setting null", function() {
                makeFieldWithSpy({
                    value: 3
                });
                tagField.setValue(null);
                expectValue([]);
                expectChange([], [3]);
            });

            it("should accept a single value", function() {
                makeFieldWithSpy();
                tagField.setValue(3);
                expectValue([3]);
                expectChange([3]);
            });

            it("should accept an array of values", function() {
                makeFieldWithSpy();
                tagField.setValue([2, 5, 11]);
                expectValue([2, 5, 11]);
                expectChange([2, 5, 11]);
            });

            it("should accept a single record", function() {
                var s = makeStore();
                makeFieldWithSpy(null, s);
                tagField.setValue(s.getAt(9));
                expectValue([10]);
                expectChange([10]);
            });

            it("should accept an array of records", function() {
                var s = makeStore();
                makeFieldWithSpy(null, s);
                tagField.setValue([s.getAt(4), s.getAt(8), s.getAt(13)]);
                expectValue([5, 9, 14]);
                expectChange([5, 9, 14]);
            });

            it("should retain the order", function() {
                makeFieldWithSpy();
                tagField.setValue([10, 6, 8, 7, 4, 5]);
                expectValue([10, 6, 8, 7, 4, 5]);
                expectChange([10, 6, 8, 7, 4, 5]);
            });

            it("should write over existing values", function() {
                makeFieldWithSpy({
                    value: [1, 3, 5, 7]
                });
                tagField.setValue([2, 4, 6, 8]);
                expectValue([2, 4, 6, 8]);
                expectChange([2, 4, 6, 8], [1, 3, 5, 7]);
            });
        });

        describe("addValue", function() {
            it("should be able to add a value", function() {
                makeFieldWithSpy();
                tagField.addValue(1);
                expectValue([1]);
                expectChange([1]);
            });

            it("should be able to add an array of values", function() {
                makeFieldWithSpy();
                tagField.addValue([3, 6, 7]);
                expectValue([3, 6, 7]);
                expectChange([3, 6, 7]);
            });

            it("should accept a single record", function() {
                makeFieldWithSpy();
                tagField.addValue(store.getAt(15));
                expectValue([16]);
                expectChange([16]);
            });

            it("should accept an array of records", function() {
                makeFieldWithSpy();
                tagField.addValue([store.getAt(1), store.getAt(5)]);
                expectValue([2, 6]);
                expectChange([2, 6]);
            });

            it("should append to the existing values", function() {
                makeFieldWithSpy({
                    value: [7, 4, 12]
                });
                tagField.addValue([3]);
                expectValue([7, 4, 12, 3]);
                expectChange([7, 4, 12, 3], [7, 4, 12]);
            });

            it("should leave existing values in place", function() {
                makeFieldWithSpy({
                    value: [7, 4, 12]
                });
                tagField.addValue([7]);
                expectValue([7, 4, 12]);
                expect(changeSpy).not.toHaveBeenCalled();
            });

            it("should only append non-existent values", function() {
                makeFieldWithSpy({
                    value: [7, 4, 12]
                });
                tagField.addValue([7, 3]);
                expectValue([7, 4, 12, 3]);
                expectChange([7, 4, 12, 3], [7, 4, 12]);
            });
        });

        describe("removeValue", function() {
            it("should be able to remove a value", function() {
                makeFieldWithSpy({
                    value: [1]
                });
                tagField.removeValue(1);
                expectValue([]);
                expectChange([], [1]);
            });

            it("should be able to remove an array of values", function() {
                makeFieldWithSpy({
                    value: [3, 6, 7]
                });
                tagField.removeValue([3, 6, 7]);
                expectValue([]);
                expectChange([], [3, 6, 7]);
            });

            it("should accept a single record", function() {
                makeFieldWithSpy({
                    value: [16]
                });
                tagField.removeValue(store.getAt(15));
                expectValue([]);
                expectChange([], [16]);
            });

            it("should accept an array of records", function() {
                makeFieldWithSpy({
                    value: [2, 6]
                });
                tagField.removeValue([store.getAt(1), store.getAt(5)]);
                expectValue([]);
                expectChange([], [2, 6]);
            });

            it("should ignore not selected values", function() {
                makeFieldWithSpy({
                    value: [18, 3, 14]
                });
                tagField.removeValue(1);
                expectValue([18, 3, 14]);
                expect(changeSpy).not.toHaveBeenCalled();
            });
        });

        describe("list selection", function() {
            var sm;

            beforeEach(function() {
                makeField();
                sm = tagField.pickerSelectionModel;
            });

            afterEach(function() {
                sm = null;
            });

            describe("changing value with the list collapsed", function() {
                it("should have the value selected and not fire a change event on expand", function() {
                    tagField.setValue([1, 3, 5]);
                    setupChangeSpy();
                    tagField.expand();
                    expect(changeSpy).not.toHaveBeenCalled();
                    expect(sm.isSelected(store.getAt(0))).toBe(true);
                    expect(sm.isSelected(store.getAt(2))).toBe(true);
                    expect(sm.isSelected(store.getAt(4))).toBe(true);
                });
            });

            describe("changing the value with the list expanded", function() {
                it("should select records when setting a value", function() {
                    tagField.expand();
                    tagField.setValue([1, 10, 13]);
                    expect(sm.isSelected(store.getAt(0))).toBe(true);
                    expect(sm.isSelected(store.getAt(9))).toBe(true);
                    expect(sm.isSelected(store.getAt(12))).toBe(true);
                });

                it("should deselect records when unsetting a value", function() {
                    tagField.setValue([1, 10, 13]);
                    tagField.expand();
                    tagField.setValue([10]);
                    expect(sm.isSelected(store.getAt(0))).toBe(false);
                    expect(sm.isSelected(store.getAt(9))).toBe(true);
                    expect(sm.isSelected(store.getAt(12))).toBe(false);
                });
            });

            describe("clicking list items", function() {
                it("should add a value when clicking an unselected item and fire change for each item", function() {
                    setupChangeSpy();
                    tagField.expand();
                    expect(changeSpy).not.toHaveBeenCalled();
                    clickListItem(store.getAt(2));
                    expectChange([3], [], 1);
                    clickListItem(4);
                    expectChange([3, 5], [3], 2);
                    clickListItem(11);
                    expectChange([3, 5, 12], [3, 5], 3);
                });

                it("should remove a value when clicking a selected item and fire change for each item", function() {
                    tagField.setValue([1, 2, 3, 4, 5]);
                    setupChangeSpy();
                    tagField.expand();
                    expect(changeSpy).not.toHaveBeenCalled();
                    clickListItem(store.getAt(2));
                    expectChange([1, 2, 4, 5], [1, 2, 3, 4, 5], 1);
                    clickListItem(store.getAt(0));
                    expectChange([2, 4, 5], [1, 2, 4, 5], 2);
                    clickListItem(store.getAt(4));
                    expectChange([2, 4], [2, 4, 5], 3);
                });
            });
        });
    });

    describe("tags", function() {
        function expectSelected(id) {
            expect(getTag(id)).toHaveCls(tagField.tagSelectedCls);
        }

        function expectNotSelected(id) {
            expect(getTag(id)).not.toHaveCls(tagField.tagSelectedCls);
        }

        describe("key handling", function() {
            var E = Ext.event.Event;

            beforeEach(function() {
                makeFieldWithSpy({
                    value: [6, 4, 10, 13, 2]
                });
            });

            // These tests fail unreliable in IE9 and IE10
            describeNotIE9_10("from the input", function() {
                it("should remove a tag when backspace is pressed and the field value is empty", function() {
                    fireInputKey(E.BACKSPACE);
                    expectValue([6, 4, 10, 13]);
                    expectChange([6, 4, 10, 13], [6, 4, 10, 13, 2]);
                });

                it("should not remove the tag when backspace is pressed and there is text in the field", function() {
                    var dom = tagField.inputEl.dom;
                    dom.value = 'asdf';
                    // Forces the cursor to the end
                    tagField.focus([4, 4]);
                    fireInputKey(E.BACKSPACE);
                    expectValue([6, 4, 10, 13, 2]);
                    expect(changeSpy).not.toHaveBeenCalled();
                });

                it("should remove a tag when delete is pressed and the field value is empty", function() {
                    fireInputKey(E.DELETE);
                    expectValue([6, 4, 10, 13]);
                    expectChange([6, 4, 10, 13], [6, 4, 10, 13, 2]);
                });

                it("should not remove the tag when delete is pressed and there is text in the field", function() {
                    var dom = tagField.inputEl.dom;
                    dom.value = 'asdf';
                    // Forces the cursor to the end
                    tagField.focus([4, 4]);
                    fireInputKey(E.DELETE);
                    expectValue([6, 4, 10, 13, 2]);
                    expect(changeSpy).not.toHaveBeenCalled();
                });

                it("should select the right most tag when pressing left and the field value is empty", function() {
                    fireInputKey(E.LEFT);
                    expectSelected(2);
                });
            });

            describe("navigation of tags", function() {
                beforeEach(function() {
                    // Select the first tag
                    fireInputKey(E.LEFT);
                });

                it("should move to the left when using the left key", function() {
                    fireInputKey(E.LEFT);
                    expectNotSelected(2);
                    expectSelected(13);

                    fireInputKey(E.LEFT);
                    expectNotSelected(13);
                    expectSelected(10);
                });

                it("should not wrap left", function() {
                    for (var i = 0; i <= 20; ++i) {
                        fireInputKey(E.LEFT);
                    }
                    expectSelected(6);
                });

                it("should keep selections when using the shift key", function() {
                    expectSelected(2);
                    expectNotSelected(13);
                    expectNotSelected(10);
                    expectNotSelected(4);
                    expectNotSelected(6);
                    fireInputKey(E.LEFT, true);
                    expectSelected(2);
                    expectSelected(13);
                    expectNotSelected(10);
                    expectNotSelected(4);
                    expectNotSelected(6);
                    fireInputKey(E.LEFT, true);
                    expectSelected(2);
                    expectSelected(13);
                    expectSelected(10);
                    expectNotSelected(4);
                    expectNotSelected(6);
                    fireInputKey(E.LEFT, true);
                    expectSelected(2);
                    expectSelected(13);
                    expectSelected(10);
                    expectSelected(4);
                    expectNotSelected(6);
                    fireInputKey(E.LEFT, true);
                    expectSelected(2);
                    expectSelected(13);
                    expectSelected(10);
                    expectSelected(4);
                    expectSelected(6);
                });

                it("should move to the right when using the right key", function() {
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    expectSelected(6);
                    // At left edge
                    fireInputKey(E.RIGHT);
                    expectNotSelected(6);
                    expectSelected(4);
                    fireInputKey(E.RIGHT);
                    expectNotSelected(4);
                    expectSelected(10);
                });

                it("shouldnot keep selections when going off the right edge", function() {
                    fireInputKey(E.LEFT);
                    expectSelected(13);
                    fireInputKey(E.RIGHT);
                    expectNotSelected(13);
                    expectSelected(2);
                    fireInputKey(E.RIGHT);
                    expectNotSelected(2);
                    expectNotSelected(6);
                });

                it("should keep selections when using the shift key", function() {
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    // At the start
                    expectNotSelected(2);
                    expectNotSelected(13);
                    expectNotSelected(10);
                    expectNotSelected(4);
                    expectSelected(6);
                    fireInputKey(E.RIGHT, true);
                    expectNotSelected(2);
                    expectNotSelected(13);
                    expectNotSelected(10);
                    expectSelected(4);
                    expectSelected(6);
                    fireInputKey(E.RIGHT, true);
                    expectNotSelected(2);
                    expectNotSelected(13);
                    expectSelected(10);
                    expectSelected(4);
                    expectSelected(6);
                    fireInputKey(E.RIGHT, true);
                    expectNotSelected(2);
                    expectSelected(13);
                    expectSelected(10);
                    expectSelected(4);
                    expectSelected(6);
                    fireInputKey(E.RIGHT, true);
                    expectSelected(2);
                    expectSelected(13);
                    expectSelected(10);
                    expectSelected(4);
                    expectSelected(6);
                });

                it("should select all when pressing ctrl+A", function() {
                    fireInputKey(E.A, false, true);
                    expectSelected(6);
                    expectSelected(4);
                    expectSelected(10);
                    expectSelected(13);
                    expectSelected(2);
                });
            });

            describe("modifying tags", function() {
                beforeEach(function() {
                    // Select the first tag
                    fireInputKey(E.LEFT);
                });

                it("should remove the selected item when pressing backspace", function() {
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.BACKSPACE);
                    expectValue([6, 4, 13, 2]);
                    expectChange([6, 4, 13, 2], [6, 4, 10, 13, 2]);
                });

                it("should remove the selected item when pressing delete", function() {
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.DELETE);
                    expectValue([6, 4, 13, 2]);
                    expectChange([6, 4, 13, 2], [6, 4, 10, 13, 2]);
                });

                it("should select the previous item after deleting", function() {
                    fireInputKey(E.DELETE);
                    expectValue([6, 4, 10, 13]);
                    expectChange([6, 4, 10, 13], [6, 4, 10, 13, 2]);
                    expectSelected(13);
                    fireInputKey(E.DELETE);
                    expectValue([6, 4, 10]);
                    expectChange([6, 4, 10], [6, 4, 10, 13], 2);
                    expectSelected(10);
                });

                it("should select the last item when deleting the first", function() {
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.LEFT);
                    fireInputKey(E.DELETE);
                    expectValue([4, 10, 13, 2]);
                    expectChange([4, 10, 13, 2], [6, 4, 10, 13, 2]);
                    expectSelected(2);
                });

                it("should remove all selected items", function() {
                    fireInputKey(E.LEFT, true);
                    fireInputKey(E.LEFT, true);
                    fireInputKey(E.DELETE);
                    expectValue([6, 4]);
                    expectChange([6, 4], [6, 4, 10, 13, 2]);
                });

                it("should be able to remove all items", function() {
                    fireInputKey(E.A, false, true);
                    fireInputKey(E.DELETE);
                    expectValue([]);
                    expectChange([], [6, 4, 10, 13, 2]);
                });
            });
        });

        describe("mouse interaction", function() {
            beforeEach(function() {
                makeFieldWithSpy({
                    value: [6, 4, 10, 13, 2]
                });
            });

            it("should select a tag when clicking", function() {
                clickTag(4);
                fireInputKey(Ext.event.Event.DELETE);
                expectValue([6, 10, 13, 2]);
                expectChange([6, 10, 13, 2], [6, 4, 10, 13, 2]);
            });

            it("should remove an item when clicking the close icon", function() {
                clickTag(4, true);
                expectValue([6, 10, 13, 2]);
                expectChange([6, 10, 13, 2], [6, 4, 10, 13, 2]);
                clickTag(13, true);
                expectValue([6, 10, 2]);
                expectChange([6, 10, 2], [6, 10, 13, 2], 2);
            });
        });
    });

    describe("pinList", function() {
        it("should keep the list open when selecting from the list with pinList: true", function() {
            makeField({
                pinList: true
            });
            tagField.expand();
            tagField.getPicker().select(0);
            expect(tagField.isExpanded).toBe(true);
        });

        it("should collapse the list when selecting from the list with pinList: false", function() {
            makeField({
                pinList: false
            });
            tagField.expand();
            tagField.getPicker().select(0);
            expect(tagField.isExpanded).toBe(false);
        });
    });

    describe("triggerOnClick", function() {
        describe("with triggerOnClick: true", function() {
            it("should not expand when clicking on an item", function() {
                makeField({
                    triggerOnClick: true,
                    value: [1]
                });
                clickTag(1);
                expect(tagField.isExpanded).toBe(false);
            });

            it("should expand when clicking on an empty area", function() {
                makeField({
                    triggerOnClick: true,
                    value: [1]
                });
                jasmine.fireMouseEvent(tagField.inputEl, 'click');
                expect(tagField.isExpanded).toBe(true);
            });
        });

        describe("with triggerOnClick: false", function() {
            it("should not expand when clicking on an item", function() {
                makeField({
                    triggerOnClick: false,
                    value: [1]
                });
                clickTag(1);
                expect(tagField.isExpanded).toBe(false);
            });

            it("should not expand when clicking on an empty area", function() {
                makeField({
                    triggerOnClick: false,
                    value: [1]
                });
                jasmine.fireMouseEvent(tagField.inputEl, 'click');
                expect(tagField.isExpanded).toBe(false);
            });
        });
    });

    describe("stacked", function() {
        describe("with stacked: true", function() {
            it("should put each item on a new line", function() {
                makeField({
                    value: 1,
                    stacked: true
                });
                var height = tagField.getHeight();
                tagField.addValue(2);
                expect(tagField.getHeight()).toBeGreaterThan(height);

                height = tagField.getHeight();
                tagField.addValue(3);
                expect(tagField.getHeight()).toBeGreaterThan(height);

                height = tagField.getHeight();
                tagField.addValue(4);
                expect(tagField.getHeight()).toBeGreaterThan(height);

                height = tagField.getHeight();
                tagField.addValue(5);
                expect(tagField.getHeight()).toBeGreaterThan(height);
            });

            it("should decrease the height when removing items", function() {
                makeField({
                    value: [1, 2, 3, 4, 5],
                    stacked: true
                });

                var height = tagField.getHeight();
                tagField.removeValue(1);
                expect(tagField.getHeight()).toBeLessThan(height);

                height = tagField.getHeight();
                tagField.removeValue(2);
                expect(tagField.getHeight()).toBeLessThan(height);

                height = tagField.getHeight();
                tagField.removeValue(3);
                expect(tagField.getHeight()).toBeLessThan(height);

                height = tagField.getHeight();
                tagField.removeValue(4);
                expect(tagField.getHeight()).toBeLessThan(height);
            });
        });

        describe("with stacked: false", function() {
            it("should put multiple items per rows", function() {
                 makeField({
                    value: 1,
                    stacked: false
                });
                var height = tagField.getHeight();
                tagField.addValue([2, 3]);
                expect(tagField.getHeight()).toBe(height);
            });

            it("should wrap when required", function() {
                makeField({
                    value: 1,
                    stacked: false,
                    width: 400
                });
                var tagWidth = Ext.fly(getTag(1)).getWidth(),
                    toWrap = Math.floor((tagField.itemList.getWidth() - tagWidth) / tagWidth),
                    height = tagField.getHeight(),
                    i;

                for (i = 0; i < toWrap; ++i) {
                    tagField.addValue(i + 2);
                }
                expect(tagField.getHeight()).toBeGreaterThan(height);


            });
        });
    });

    describe("filterPickList", function() {
        it("should filter the list when configured with values", function() {
            makeField({
                filterPickList: true,
                value: [1, 4, 7]
            });
            tagField.expand();
            var valueStore = tagField.valueStore,
                rec0 = valueStore.getAt(0),
                rec3 = valueStore.getAt(1),
                rec6 = valueStore.getAt(2);

            expect(store.getCount()).toBe(17);
            
            // The three picked values should not be found in the filtered store
            expect(store.indexOf(rec0)).toBe(-1);
            expect(store.indexOf(rec3)).toBe(-1);
            expect(store.indexOf(rec6)).toBe(-1);
        });

        it("should filter the list when setting the value", function() {
            makeField({
                filterPickList: true
            });
            tagField.expand();
            var rec16 = store.getAt(16);

            expect(store.getCount()).toBe(20);
            tagField.setValue(17);

            // The record for value 17, rec16 should be filtered out of the store
            expect(store.getCount()).toBe(19);
            expect(store.indexOf(rec16)).toBe(-1);
        });

        it("should filter the list when adding a value", function() {
            makeField({
                filterPickList: true,
                value: [1, 4, 7]
            });
            tagField.expand();
            var valueStore = tagField.valueStore,
                rec0 = valueStore.getAt(0),
                rec3 = valueStore.getAt(1),
                rec6 = valueStore.getAt(2),
                rec1 = store.getAt(0);

            expect(store.getCount()).toBe(17);
            
            // The tree picked values should not be found in the filtered store
            expect(store.indexOf(rec0)).toBe(-1);
            expect(store.indexOf(rec3)).toBe(-1);
            expect(store.indexOf(rec6)).toBe(-1);

            tagField.addValue(2);

            // The record for value 2, rec1 should be filtered out of the store
            expect(store.getCount()).toBe(16);
            expect(store.indexOf(rec1)).toBe(-1);
        });

        it("should filter the list when removing a value", function() {
            makeField({
                filterPickList: true,
                value: [1, 4, 7]
            });
            tagField.expand();
            var rec0 = tagField.valueStore.getAt(0);

            expect(store.getCount()).toBe(17);
            expect(store.indexOf(rec0)).toBe(-1);
            tagField.removeValue(1);

            // The record for value 1, rec0 should filtered back into the store
            expect(store.getCount()).toBe(18);
            expect(store.indexOf(rec0)).toBe(0);
        });
    });

    // These tests fails unreliably on IE9 and 10 on a VM
    describeNotIE9_10('creating new values', function() {
        it('should add a new record when ENTER is pressed if createNewOnEnter', function() {
            makeField({
                createNewOnEnter: true,
                value: [1, 4, 7]
            });
            tagField.inputEl.dom.value = '200';
            jasmine.fireKeyEvent(tagField.inputEl.dom, 'keyup', Ext.EventObject.ENTER);
            var v = tagField.getValue();

            // The new value should have been added to the value list.
            expect(v.length).toBe(4);
            expect(v[3]).toBe('200');
        });

        it('should add a new record on blur if createNewOnBlur', function() {
            makeField({
                createNewOnBlur: true,
                value: [1, 4, 7]
            });
            tagField.focus();
            jasmine.waitForFocus(tagField);
            runs(function() {
                tagField.inputEl.dom.value = '200';

                // Programmatic blur fails on IEs. Focus then remove an input field
                Ext.getBody().createChild({tag: 'input', type: 'text'}).focus().remove();
            });
            jasmine.waitAWhile();
            runs(function() {
                var v = tagField.getValue();
                // The new value should have been added to the value list.
                expect(v.length).toBe(4);
                expect(v[3]).toBe('200');
            });
        });
    });

    describe("allowBlank: false", function() {
        it("should be invalid when blank, and valid when a value is selected", function() {
            makeField({
                allowBlank: false
            });
            expect(tagField.isValid()).toBe(false);
            tagField.setValue(1);
            expect(tagField.isValid()).toBe(true);
        });
    });

    describe('Erasing back to zero length input', function() {
        it('should not clear the value on erase back to zero length with no query', function() {
            var value;

            makeField({
                value: [1, 4, 7]
            });
            doTyping('foo');

            // This is an erase back to zero length
            doTyping('', true);

            value = tagField.getValue();
            expect(value.length).toBe(3);
            expect(value[0]).toBe(1);
            expect(value[1]).toBe(4);
            expect(value[2]).toBe(7);
        });
        it('should not clear the value on erase back to zero length after a query', function() {
            var value;

            makeField({
                value: [1, 4, 7]
            });
            doTyping('I');

            // We must wait until the query has happened
            waitsFor(function() {
                return tagField.picker && tagField.picker.isVisible();
            });

            runs(function() {
                // This is an erase back to zero length
                doTyping('', true);

                value = tagField.getValue();
                expect(value.length).toBe(3);
                expect(value[0]).toBe(1);
                expect(value[1]).toBe(4);
                expect(value[2]).toBe(7);
            });
        });
    });

    describe("sizing", function() {
        it("should publish the height correctly when the set width in the container will cause wrapping while collapsed", function() {
            makeField({
                renderTo: null,
                flex: 1
            });

            var p = new Ext.panel.Panel({
                width: 200,
                border: false,
                bodyStyle: 'border: 0',
                collapsed: true,
                renderTo: Ext.getBody(),
                layout: 'hbox',
                items: tagField
            });
            tagField.setValue([1, 4, 7, 9]);
            p.expand(false);
            expect(p.getHeight()).toBe(tagField.getHeight());
            p.destroy();
        });
    });

    describe("destruction", function() {
        it("should not throw an exception when destroying with an autoCreated store and filterPickList: true", function() {
            makeField({
                filterPickList: true,
                store: [
                    [1, 'Foo'],
                    [2, 'Bar']
                ]
            }, null);
            clickListItem(tagField.getStore().getAt(0));
            expect(function() {
                tagField.destroy();
            }).not.toThrow();
        });
    });
});