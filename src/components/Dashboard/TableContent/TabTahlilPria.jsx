import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import ModalEdit from "../ModalEdit";
import ModalDelete from "../ModalDelete";
import axios from "axios";
import { Spinner } from "flowbite-react";

const TabTahlilPria = ({ searchDatas, onCheckbox, onLoad, loading }) => {
  const [member, setMember] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedIdMember, setSelectedIdmember] = useState("");
  const [show, setShow] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showDel, setShowDel] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  useEffect(() => {
    getMembersJmtPria();
  }, []);
  const getMembersJmtPria = async () => {
    try {
      onLoad(true);
      const res = await axios.get("http://127.0.0.1:3000/members/jmtPria");
      setMember(res.data);
    } catch (err) {
      console.log(err);
    }
    onLoad(false);
  };

  const filterDataSearch = member.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchDatas.toLowerCase())
    );
  });

  const toggleModalEdit = () => {
    setShow(!show);
  };

  const toggleModalDel = () => {
    setShowDel(!showDel);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    const id = e.target.id;
    try {
      await axios.delete(`http://127.0.0.1:3000/members/jmtPria/delete/${id}`);
      getMembersJmtPria();
    } catch (error) {
      console.log(error);
    }
    toggleModalDel();
  };

  const handlegetUserRemove = async (e) => {
    e.preventDefault();
    const id = e.target.id;
    try {
      const res = await axios.get(
        `http://127.0.0.1:3000/members/jmtPria/${id}`
      );
      setSelectedMember(res.data);
      setSelectedIdmember(id);
    } catch (error) {
      console.log(error);
    }
    toggleModalDel();
  };

  const handleEditButton = async (e) => {
    const id = e.target.id;
    if (selectedUserIds.length >= 1) {
      console.log("edit beberapa");
    }
    try {
      const res = await axios.get(
        `http://127.0.0.1:3000/members/jmtPria/${id}`
      );
      setSelectedMember(res.data);
      setSelectedIdmember(id);
    } catch (error) {
      console.log(error);
    }
    toggleModalEdit();
  };

  const checkAll = (e) => {
    const checkboxes = document.getElementsByName("inputCheck");
    const checkboxs = Array.from(checkboxes);
    const isChecked = e.target.checked;
    setIsCheckAll();
    if (isChecked) {
      const newCheckedItems = [];
      const newSelectedUserIds = [];
      filterDataSearch.forEach((item) => {
        newCheckedItems[item._id] = isChecked;
      });
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems({});
      setSelectedUserIds([]);
    }
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
      if (checkbox.checked) {
        onCheckbox(checkbox.id, isChecked);
        setSelectedUserIds((prevCheckedIds) => {
          if (isChecked) {
            return [...prevCheckedIds, checkbox.id];
          } else {
            return prevCheckedIds.filter(
              (checkedId) => checkedId !== checkbox.id
            );
          }
        });
      } else {
        console.log("Tidak ada data yang dipilih");
      }
    });
  };
  const handleCheckboxChange = async (e) => {
    const id = e.target.id;
    const isChecked = e.target.checked;
    onCheckbox(id, isChecked);
    setSelectedUserIds((checkedIds) => {
      if (isChecked) {
        return [...checkedIds, id];
      } else {
        return checkedIds.filter((checkedId) => checkedId !== id);
      }
    });
    setCheckedItems({ ...checkedItems, [id]: isChecked });
    // checkAll();
  };

  const clearItems = () => {
    setCheckedItems({});
    setSelectedUserIds([]);
    setIsCheckAll(false);
  };

  const dataTampil = filterDataSearch.slice(0, 100);
  return (
    <div className="w-full h-full">
      {show && (
        <ModalEdit
          isShow={show}
          tab={"Tahlil Pria"}
          data={selectedMember}
          id={selectedIdMember}
          allData={getMembersJmtPria()}
          onShow={toggleModalEdit}
          onClear={clearItems}
          onCheck={handleCheckboxChange}
          checkedIds={selectedUserIds}
        />
      )}
      {showDel && (
        <ModalDelete
          isShow={showDel}
          tab={"Tahlil Pria"}
          onShow={toggleModalDel}
          data={selectedMember}
          id={selectedIdMember}
          allData={getMembersJmtPria()}
          onDelete={handleRemove}
          onClear={clearItems}
          onCheck={handleCheckboxChange}
          checkedIds={selectedUserIds}
          checkedItems={checkedItems}
        />
      )}
      {loading ? (
        <div className="w-full h-full flex items-center justify-center margin-auto flex-col">
          <Spinner aria-label="Medium sized spinner example" size="xl" />
          <span className="text-lg">Loading...</span>
        </div>
      ) : (
        <table className="w-full min-w-full text-left shadow-md rounded-md">
          <thead className="bg-gray-200 rounded-md">
            <tr className="rounded-md">
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 ">
                <input
                  type="checkbox"
                  name=""
                  checked={isCheckAll}
                  id="all"
                  className="rounded-sm"
                  onChange={checkAll}
                />
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-center text-sm">
                  No
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Nama Ketua
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  NIK
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  NO HP
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Kecamatan
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Desa
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Dusun
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  RT
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  RW
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Jumlah Anggota
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Nama Jamaah
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  REK
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 text-center">
                <Typography className="font-normal leading-none opacity-70 text-sm">
                  Action
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataTampil.map((jmt, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                <td className="px-2 text-center">
                  <input
                    type="checkbox"
                    name="inputCheck"
                    checked={checkedItems[jmt._id] || false}
                    className="rounded-sm"
                    value={selectedUserIds}
                    id={jmt._id}
                    onChange={handleCheckboxChange}
                  />
                </td>
                <td className="px-2 text-center">{index + 1}</td>
                <td className="px-2 text-center">{jmt.NAMA_KETUA}</td>
                <td className="px-2 text-center">{jmt.NIK}</td>
                <td className="px-2 text-center">{jmt.NO_HP}</td>
                <td className="px-2 text-center">{jmt.KECAMATAN}</td>
                <td className="px-2 text-center">{jmt.DESA}</td>
                <td className="px-2 text-center">{jmt.DUSUN}</td>
                <td className="px-2 text-center">{jmt.RT}</td>
                <td className="px-2 text-center">{jmt.RW}</td>
                <td className="px-2 text-center">{jmt.JUMLAH_ANGGOTA}</td>
                <td className="px-2 text-center">{jmt.NAMA_JAMAAH}</td>
                <td className="px-2 text-center">{jmt.REK}</td>
                <td className="px-2 text-center">
                  <div className="w-32 h-10 flex items-center justify-evenly">
                    {/* <Link className="w-full h-full flex items-center justify-center" to={`/edit/${jmt._id}`}> */}
                    <button
                      id={`${jmt._id}`}
                      onClick={handleEditButton}
                      className="w-12 h-4/5 rounded-md flex items-center justify-center bg-green-500 text-white"
                    >
                      Edit
                    </button>
                    {/* </Link> */}
                    <button
                      id={`${jmt._id}`}
                      onClick={handlegetUserRemove}
                      className="w-12 h-4/5 rounded-md flex items-center justify-center text-white bg-red-500"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TabTahlilPria;
