import React, { useState, useEffect, useMemo } from 'react';
import Inputbox from '../../common/Inputbox';

export default function FabricSelectTable({ fabricList, setAssignModel, assignModel }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFabricIds, setSelectedFabricIds] = useState([]);

    // Filtered fabrics based on the search term
    const filteredFabrics = useMemo(() => {
        return fabricList?.filter(fabric =>
            fabric?.fabricCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [fabricList, searchTerm]);

    // Check if all filtered fabrics are selected
    const allSelected = useMemo(() => (
        filteredFabrics?.length > 0 &&
        filteredFabrics?.every(fabric => selectedFabricIds?.includes(fabric.id))
    ), [filteredFabrics, selectedFabricIds]);

    // Update assignModel and selectedFabricIds when toggling an individual fabric
    const toggleSelectFabric = (fabricId) => {
        setSelectedFabricIds(prevSelected => {
            const isSelected = prevSelected.includes(fabricId);
            const updatedSelected = isSelected
                ? prevSelected.filter(id => id !== fabricId)
                : [...prevSelected, fabricId];

            setAssignModel(prevModel => ({
                ...prevModel,
                fabricIds: updatedSelected,
                forAllFabric: updatedSelected.length === filteredFabrics?.length ? 1 : 2,
            }));
            return updatedSelected;
        });
    };

    // Handle select/deselect all fabrics
    const handleSelectAll = () => {
        const updatedSelected = allSelected
            ? selectedFabricIds?.filter(id => !filteredFabrics?.some(fabric => fabric.id === id))
            : [...new Set([...selectedFabricIds, ...filteredFabrics?.map(fabric => fabric.id)])];

        setSelectedFabricIds(updatedSelected);
        setAssignModel(prevModel => ({
            ...prevModel,
            fabricIds: updatedSelected,
            forAllFabric: updatedSelected.length === filteredFabrics?.length ? 1 : 2,
        }));
    };

    // Sync selection with forAllFabric in assignModel
    useEffect(() => {
        if (assignModel.forAllFabric === 1) {
            setSelectedFabricIds(filteredFabrics?.map(fabric => fabric.id));
        } else if (assignModel.forAllFabric === 2) {
            setSelectedFabricIds([]);
        }
    }, [assignModel.forAllFabric, filteredFabrics]);

    // Handle search input change
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    return (
        <div>
            <div className='text-center'><h2>Fabric Selection Table</h2></div>
            <div className='d-flex justify-content-between mb-2'>
                <div>
                    <Inputbox
                        type="text"
                        placeholder="Search by fabric code..."
                        value={searchTerm}
                        onChangeHandler={handleSearchChange}
                        className="form-control-sm"
                        showLabel={false}
                    />
                </div>
                <div>
                    <strong>Selected</strong> <span>{String(selectedFabricIds?.length).padStart(3, '0')}/{filteredFabrics?.length}</span>
                </div>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                <table className='table table-bordered fixTableHead'>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                /> Select All
                            </th>
                            <th>Code</th>
                            <th>Brand</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Type</th>
                            <th>Print Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFabrics?.map(fabric => (
                            <tr key={fabric.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedFabricIds?.includes(fabric.id)}
                                        onChange={() => toggleSelectFabric(fabric.id)}
                                    />
                                </td>
                                <td>{fabric.fabricCode}</td>
                                <td>{fabric.brandName}</td>
                                <td>{fabric.fabricColorName}</td>
                                <td>{fabric.fabricSizeName}</td>
                                <td>{fabric.fabricTypeName}</td>
                                <td>{fabric.fabricPrintType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
