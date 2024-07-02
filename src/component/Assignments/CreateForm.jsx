import { useEffect, useState } from 'react';
import {
  Label,
  TextInput,
  Button,
  Modal,
  FileInput,
  Select,
  Progress,
  Alert,
} from 'flowbite-react';
import { ImCross } from 'react-icons/im';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../../firebase.js';
import { useSelector } from 'react-redux'

export function CreateForm({ openModal, setOpenModal, createAssignment }) {
  const [assignmentWeek, setAssignmentWeek] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [maxmarks, setMaxMarks] = useState(0);
  const [assignmentTechnology, setAssignmentTechnology] = useState('Java');
  const [assignmentDuedate, setAssignmentDuedate] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentFileName, setAssignmentFileName] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [assignmentFileUrl, setAssignmentFileUrl] = useState(null);
  const [assignmentFileUploadProgress, setAssignmentFileUploadProgress] = useState(null);
  const [assignmentFileUploadError, setAssignmentFileUploadError] = useState(null);
  const [assignmentFileUploading, setAssignmentFileUploading] = useState(false);
  const [talentList, setTalentList] = useState([]);
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState([]);
  useEffect(() => {
    if (assignmentFile) {
      handleFileUpload();
    }
  }, [assignmentFile]);

  useEffect(() => {
    fetchTalentList()
  }, [])
  const token = useSelector(state => state.user.token)

  const technologySkills = {
    Java: ['Java', 'Spring', 'Hibernate'],
    React: ['React', 'JavaScript', 'HTML', 'CSS'],
    JavaScript: ['JavaScript', 'Node.js', 'Express.js'],
    'UI 5': ['UI 5', 'SAPUI5', 'HTML', 'CSS'],
    Integration: ['Integration', 'API', 'Microservices'],
    // Add SolidWorks, AutoCAD, ANSYS for relevant technologies
    'Mechanical Engineering': ['SolidWorks', 'AutoCAD', 'ANSYS'],
    'Civil Engineering': ['AutoCAD', 'Revit', 'STAAD.Pro'],
    // Add more technologies and their required skills as needed
  }

  useEffect(() => {
    if (!assignmentTechnology) return // Exit if technology is not selected

    const filteredList = talentList.filter(talent => {
      if (!talent.talentSkills) return false // Skip talents with no skills
      const requiredSkills = talent.talentSkills
        .split(',')
        .map(skill => skill.trim())
      return requiredSkills.includes(assignmentTechnology)
    })
    setFilteredTalentList(filteredList)
  }, [assignmentTechnology, talentList])

  const fetchTalentList = async () => {
    try {
      const response = await fetch('http://192.168.0.147:8080/cpm/talents/alltalent', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch talent list');
      }
      const data = await response.json();
      setTalentList(data);
      console.log('Talent list:', data);
    } catch (error) {
      console.error('Error fetching talent list:', error);
    }
  }
  const handleselectedtalent = (talent, index) => {
    const newselectedtalent = selectedTalents.filter((tal, i) => tal != talent)
    setSelectedTalents(newselectedtalent)
  }
  const selectedTalentEmails = selectedTalents.map((talent) => {
    // Find talent by email in talentList and return email
    const foundTalent = talentList.find((t) => t.email === talent);
    return foundTalent ? foundTalent.email : null;
  });
  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      assignmentWeek,
      maxmarks,
      assignmentName,
      assignmentTechnology,
      assignmentDuedate,
      assignmentFileName,
      assignmentFileUrl,
      assignedTo: selectedTalentEmails.join(', '), 
      mentorAssigned:"mokshthakran80299@gmail.com"
        }
    console.log(formData)
    createAssignment(formData)
  }

  const handleFileUpload = async () => {
    try {
      if (!assignmentFile) {
        setAssignmentFileUploadError('No file selected');
        return;
      }

      if (
        !assignmentFile.type.startsWith('application/pdf') ||
        assignmentFile.size > 2 * 1024 * 1024
      ) {
        setAssignmentFileUploadError('File must be of type pdf and less than 2MB');
        setAssignmentFile(null);
        setAssignmentFileUrl(null);
        setAssignmentFileUploadProgress(null);
        return;
      }

      setAssignmentFileUploadError(null);
      setAssignmentFileUploading(true);
      const storage = getStorage(app);
      const fileName = assignmentFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, assignmentFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setAssignmentFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setAssignmentFileUploadError('Could not upload file');
          setAssignmentFileUploadProgress(null);
          setAssignmentFile(null);
          setAssignmentFileName(null);
          setAssignmentFileUrl(null);
          setAssignmentFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setAssignmentFileUploadProgress(null);
            setAssignmentFileUrl(downloadURL);
            setAssignmentFileUploading(false);
            console.log(downloadURL);
          });
        }
      );
    } catch (error) {
      setAssignmentFileUploadError('Could not upload file');
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setAssignmentFile(e.target.files[0]);
    setAssignmentFileName(e.target.files[0].name);
  };

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentWeek" value="Assignment Week" />
            </div>
            <TextInput
              id="assignmentWeek"
              type="text"
              placeholder="Enter assignment week"
              value={assignmentWeek}
              onChange={(e) => setAssignmentWeek(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentName" value="Assignment Name" />
            </div>
            <TextInput
              id="assignmentName"
              type="text"
              placeholder="Enter assignment name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
              size="sm"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentName" value="Trainer Name" />
            </div>
            <TextInput
              id="TrainerName"
              type="text"
              placeholder="Enter Trainer name"
              value={"Abhimanyu Kaushik "}
              required
              size="sm"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="MaxMarks" value="Max Marks" />
            </div>
            <TextInput
              id="maxmarks"
              type="text"
              placeholder="Enter Max Marks"
              value={maxmarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              required
              size="sm"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentTechnology" value="Assignment Technology" />
            </div>
            <Select
              id="assignmentTechnology"
              value={assignmentTechnology}
              onChange={(e) => setAssignmentTechnology(e.target.value)}
              required
              size="sm"
            >
              <option>Java</option>
              <option>React</option>
              <option>JavaScript</option>
              <option>UI 5</option>
              <option>Integration</option>
              <option>SolidWorks</option>
              <option>AutoCAD</option>
              <option>ANSYS</option>
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentDuedate" value="Assignment Due Date" />
            </div>
            <TextInput
              id="assignmentDuedate"
              type="date"
              value={assignmentDuedate}
              onChange={(e) => setAssignmentDuedate(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignmentFile" value="Assignment File" />
            </div>
            <FileInput
              id="assignmentFile"
              type="file"
              helperText="PDF (Max size 2 MB)"
              accept=".pdf"
              onChange={handleFileChange}
              required
              size="sm"
            />
          </div>
          {assignmentFileUploadProgress && (
            <Progress progress={assignmentFileUploadProgress} />
          )}
          {assignmentFileUploadError && (
            <Alert color="failure">{assignmentFileUploadError}</Alert>
          )}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignedTo" value="Assigned To" />
            </div>
            <Select
              id='assignedTo'
              value={assignedTo}
              onChange={(e) => {
               
                const selectedValues = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                
                const uniqueSelectedValues = selectedValues.filter(
                  (value) => !selectedTalents.includes(value)
                );
                setSelectedTalents((prevSelected) => [
                  ...prevSelected,
                  ...uniqueSelectedValues,
                ]);
              }}
              multiple
              size="sm"
            >
              {filteredTalentList.map((talent) => (
                <option key={talent.talentId} value={talent.email}>
                  {talent.talentName} - {talent.email}
                </option>
              ))}
            </Select>
            {selectedTalents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Talents:
                </label>
                <div className="mt-2 flex flex-wrap">
                  {selectedTalents.map((talent, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white"
                    >
                      {talent}
                      <div
                        onClick={() => handleselectedtalent(talent)}
                        className="ml-2 cursor-pointer"
                      >
                        <ImCross />
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button type="submit" color="blue" size="sm">
            Create Assignment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
